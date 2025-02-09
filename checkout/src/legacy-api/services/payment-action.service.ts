import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccessTokenPayload, EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ActionApiCallSchemaName, ApiCallSchemaName } from '../../mongoose-schema';
import {
  ActionApiCallDto,
  ActionWrapperDto,
  ApiCallResultDto,
  HeadersHolderDto,
  TransactionHistoryDto,
  TransactionHistoryQueryDto,
} from '../dto';
import {
  ActionApiCallStatusEnum,
  LegacyApiEventEnum,
  PaymentActionsEnum,
  TwoFactorTypeEnum,
  UrlActionsToPaymentActions,
} from '../enum';
import { RawRequestInterface } from '../interfaces';
import { ActionApiCallModel, PaymentModel } from '../models';
import { ActionDtoTransformer } from '../transformer';
import { PaymentDataHelper } from '../helpers';
import { FastifyRequest } from 'fastify';
import { PaymentService } from './payment.service';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';
import { Payment2faPinService } from './payment-2fa-pin.service';
import { ApiCallModel } from '../../common/models';
import { ApiCallService, OauthService } from '../../common/services';
import { ExternalApiExecutor } from './external-api.executor';

@Injectable()
export class PaymentActionService {
  constructor(
    @InjectModel(ApiCallSchemaName) private readonly apiCallModel: Model<ApiCallModel>,
    @InjectModel(ActionApiCallSchemaName) private readonly actionApiCallModel: Model<ActionApiCallModel>,
    private readonly paymentService: PaymentService,
    private readonly apiCallService: ApiCallService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly payment2faPinService: Payment2faPinService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
    private readonly oauthService: OauthService,
  ) { }

  public async doAction(
    payment: PaymentModel,
    action: string,
    dto: object,
    businessId: string,
    req?: FastifyRequest<any>,
  ): Promise<ApiCallResultDto> {
    const executionStartTime: [number, number] = process.hrtime();

    action = UrlActionsToPaymentActions.get(action.toLowerCase());

    const actionDto: object = ActionDtoTransformer.actionToRequestDTO(action, dto);

    const actionApiCall: ActionApiCallDto = new ActionApiCallDto();
    actionApiCall.action = action;
    actionApiCall.businessId = businessId;
    actionApiCall.paymentId = payment.original_id;
    actionApiCall.requestData = dto;

    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);
    const actionWrapper: ActionWrapperDto = Object.assign(new ActionWrapperDto(), headersHolder);
    actionWrapper.action = action;
    actionWrapper.payloadDto = actionDto;

    try {
      await this.eventDispatcher.dispatch(LegacyApiEventEnum.beforePaymentAction, payment, action, actionDto);

      const requires2FA: boolean = await this.requires2FA(payment, action);

      if (requires2FA) {
        await this.payment2faPinService.send2faPinForPayment(payment);
      } else {
        payment = await this.paymentService.externalAction(payment, actionWrapper);
        await this.eventDispatcher.dispatch(LegacyApiEventEnum.afterPaymentAction, payment, action);
      }

      const executionEndTime: [number, number] = process.hrtime(executionStartTime);
      actionApiCall.executionTime = `${executionEndTime[0]}s ${executionEndTime[1] / 1000000}ms`;
      actionApiCall.status = ActionApiCallStatusEnum.success;
      await this.createActionApiCallFromDto(actionApiCall);

      return this.responseTransformer.successPaymentActionResponse(payment, action, actionDto, requires2FA);
    } catch (e) {
      this.logger.log(
        {
          action: action,
          bodyDto: dto,
          businessId: businessId,
          error: e.message,
          headers: req?.headers,
          message: `Received error during action api call for business id ${businessId}`,
          requestBody: (req?.raw as RawRequestInterface).body,
          requestRawBody: (req?.raw as RawRequestInterface).body,
        },
      );

      const executionEndTime: [number, number] = process.hrtime(executionStartTime);
      actionApiCall.executionTime = `${executionEndTime[0]}s ${executionEndTime[1] / 1000000}ms`;
      actionApiCall.error = e.message;
      actionApiCall.status = ActionApiCallStatusEnum.failed;
      await this.createActionApiCallFromDto(actionApiCall);

      return this.responseTransformer.failedPaymentActionResponse(payment, action, actionDto, e.message);
    }
  }

  public async getTransactionHistory(
    payment: PaymentModel,
    action: string,
    req: FastifyRequest<any>,
    limit: number,
  ): Promise<TransactionHistoryDto[]> {
    action = UrlActionsToPaymentActions.get(action.toLowerCase());

    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

    return this.externalApiExecutor.getTransactionHistory(
      headersHolder,
      payment,
      action,
      limit,
    );
  }

  public async getTransactionHistories(
    user: AccessTokenPayload,
    paymentId: string,
    req: FastifyRequest<any>,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {
    let businessId: string = null;
    try {
      businessId = this.oauthService.getOauthUserBusiness(user);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get transactions history`);
    }

    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

    return this.externalApiExecutor.getRecentTransactionHistoryEntries(
      headersHolder,
      businessId,
      paymentId,
      queryDto,
    );
  }

  public async getRecentTransactionHistory(
    user: AccessTokenPayload,
    action: string,
    req: FastifyRequest<any>,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {

    let businessId: string = null;
    try {
      businessId = this.oauthService.getOauthUserBusiness(user);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get transactions history`);
    }

    action = UrlActionsToPaymentActions.get(action.toLowerCase());
    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

    return this.externalApiExecutor.getRecentTransactionHistory(
      headersHolder,
      businessId,
      action,
      queryDto,
    );
  }

  private async requires2FA(
    paymentModel: PaymentModel,
    action: string,
  ): Promise<boolean> {
    if (action !== PaymentActionsEnum.VERIFY || !paymentModel.api_call_id) {
      return false;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(paymentModel.api_call_id);

    return apiCall
      && apiCall.verify_two_factor
      && apiCall.verify_two_factor !== TwoFactorTypeEnum.none
      && !apiCall.two_factor_triggered
    ;
  }

  private async createActionApiCallFromDto(actionApiCallDto: ActionApiCallDto): Promise<ActionApiCallModel> {
    const createdModel: ActionApiCallModel = await this.actionApiCallModel.create(actionApiCallDto);
    await this.eventDispatcher.dispatch(LegacyApiEventEnum.actionApiCallCreated, createdModel);

    return createdModel;
  }
}
