import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { IntercomService, UserTokenInterface } from '@pe/nest-kit';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  PaymentActionSourceEnum,
  RefundCaptureTypeEnum,
  ThirdPartyPaymentActionsEnum,
  TransactionActionsToThirdPartyActions,
} from '../enum';
import { ActionCallerInterface, ActionItemInterface, TransactionUnpackedDetailsInterface } from '../interfaces';
import { ActionPayloadInterface } from '../interfaces/action-payload';
import { TransactionsService } from './transactions.service';
import { ActionOptionItemInterface } from 'src/transactions/interfaces/action-option-item.interface';
import { ActionWrapperDto, DownloadResourceDto } from '../dto';
import { ActionDescriptionHelper, RequestDataHelper } from '../helpers';
import { ActionPayloadDto } from '../dto/action-payload';
import { environment } from '../../environments';
import { SettlementReportRequestDto } from '../dto/settlement';
import * as _ from 'lodash';

@Injectable()
export class ThirdPartyCallerService implements ActionCallerInterface {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly intercomService: IntercomService,
    private readonly logger: Logger,
  ) {
  }

  public async getActionsList(
    transaction: TransactionUnpackedDetailsInterface,
  ): Promise<ActionItemInterface[]> {
    let actions: ActionItemInterface[] = [];

    const actionPayload: ActionPayloadInterface = {
      paymentId: transaction.uuid,
    };

    try {
      const actionWrapper: ActionWrapperDto = {
        actionUrl: ThirdPartyPaymentActionsEnum.actionOptions,
        payloadDto: actionPayload,
      };

      const actionOptions: ActionOptionItemInterface[] = await this.runThirdPartyAction(
        transaction,
        actionWrapper,
      );

      actions = actionOptions.map((actionOption: ActionOptionItemInterface ) => {
        return {
          action: actionOption.action,
          description: actionOption.description ?
            actionOption.description :
            ActionDescriptionHelper[actionOption.action],
          enabled: actionOption.allowed,
          isOptional: actionOption.isOptional ? actionOption.isOptional : false,
          partialAllowed: actionOption.partialAllowed ? actionOption.partialAllowed : false,
          refundCaptureType:
            actionOption.refundCaptureType ? actionOption.refundCaptureType : RefundCaptureTypeEnum.virtual,
        };
      });
    } catch (e) {
      const actionWrapper: ActionWrapperDto = {
        actionUrl: ThirdPartyPaymentActionsEnum.actionList,
        payloadDto: actionPayload,
      };

      const actionsResponse: { [key: string]: boolean } = await this.runThirdPartyAction(
        transaction,
        actionWrapper,
      );

      if (Object.keys(actionsResponse).length) {
        actions = Object.keys(actionsResponse)
          .map(
            (key: string) => ({
              action: key,
              description: ActionDescriptionHelper[key],
              enabled: actionsResponse[key],
              isOptional: false,
              partialAllowed: false,
              refundCaptureType: RefundCaptureTypeEnum.virtual,
            }),
          );
      }
    }

    /**
     * This hack is only for FE improvement. FE for "Edit action" is not implemented in DK.
     * Thus we disable it here to prevent inconveniences.
     */
    if (transaction.type === 'santander_installment_dk' || transaction.type === 'santander_pos_installment_dk') {
      actions = actions.filter((x: ActionItemInterface) => x.action !== 'edit');
    }

    return actions;
  }

  public async runAction(
    transaction: TransactionUnpackedDetailsInterface,
    actionWrapper: ActionWrapperDto,
  ): Promise<any> {
    const action: string = actionWrapper.action;
    const actionPayload: ActionPayloadInterface = actionWrapper.payloadDto;

    if (!TransactionActionsToThirdPartyActions.has(action.toLowerCase())) {
      throw new NotFoundException(`Action ${action} is not supported`);
    }

    actionWrapper.actionUrl = TransactionActionsToThirdPartyActions.get(action.toLowerCase());
    actionPayload.paymentId = transaction.uuid;
    actionPayload.source =
      actionWrapper.isExternalApiCall ? PaymentActionSourceEnum.external : PaymentActionSourceEnum.internal;
    actionWrapper.payloadDto = actionPayload as ActionPayloadDto;

    const result: any = await this.runThirdPartyAction(transaction, actionWrapper);

    await this.updateTransactionFromThirdPartyResult(transaction, result);

    return result;
  }

  public async updateStatus(
    transaction: TransactionUnpackedDetailsInterface,
  ): Promise<void> {
    const actionWrapper: ActionWrapperDto = {
      actionUrl: ThirdPartyPaymentActionsEnum.actionUpdateStatus,
      payloadDto: { paymentId: transaction.uuid },
    };
    const result: any = await this.runThirdPartyAction(
      transaction,
      actionWrapper,
    );

    await this.updateTransactionFromThirdPartyResult(transaction, result);
  }

  public async retrieveSettlementReport(
    settlementReportRequestDto: SettlementReportRequestDto,
    businessId: string,
  ): Promise<any> {
    const paymentMethod: string = settlementReportRequestDto.filter.payment_method;
    const url: string =
      `${environment.thirdPartyPaymentsMicroUrl}`
      + `/api/business/${businessId}/integration/${paymentMethod}/action/settlement-report`;

    this.logger.log({
      message: 'Starting third party settlement report action call',
      url: url,
    });

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      url,
      ThirdPartyCallerService.convertKeysToCamelCase({ ...settlementReportRequestDto.filter, businessId }),
    );

    return response.pipe(
      map((res: any) => {
        this.logger.log({
          message: 'Received response from third party settlement report action call',
          response: res.data,
          url: url,
        });

        return res.data;
      }),
      catchError((error: AxiosError) => {
        this.logger.error({
          error: error?.response?.data?.message || error.message,
          message: 'Failed response from third party settlement response action call',
          url: url,
        });

        throw new PreconditionFailedException(error?.response?.data?.message || error.message);
      }),
    )
      .toPromise();
  }

  public async downloadContract(
    transaction: TransactionUnpackedDetailsInterface,
  ): Promise<DownloadResourceDto> {
    const url: string =
      `${environment.thirdPartyPaymentsMicroUrl}`
      /* eslint max-len: 0 */
      + `/api/download-resource/business/${transaction.business_uuid}/integration/${transaction.type}/action/contract?paymentId=${transaction.original_id}&rawData=true`;

    this.logger.log({
      message: 'Starting third party download contract action call',
      transaction: transaction.original_id,
      url: url,
    });

    const response: Observable<AxiosResponse<any>> = await this.intercomService.get(url);

    return response.pipe(
      map((res: any) => {
        this.logger.log({
          message: 'Received response from third party download contract action call',
          transaction: transaction.original_id,
          url: url,
        });

        return res.data;
      }),
      catchError((error: AxiosError) => {
        this.logger.error({
          error: error.response.data,
          message: 'Failed response from third party download contract action call',
          transaction: transaction.original_id,
          url: url,
        });

        throw new HttpException(error.response.data.message, error.response.data.code);
      }),
    )
      .toPromise();
  }

  private async updateTransactionFromThirdPartyResult(
    transaction: TransactionUnpackedDetailsInterface,
    result: any,
  ): Promise<void> {
    const oldStatus: string = transaction.status;
    const oldSpecificStatus: string = transaction.specific_status;
    const newStatus: string = result?.payment?.status;
    const newSpecificStatus: string = result?.payment?.specificStatus;

    const updateData: any = { };

    if (newStatus && newStatus !== oldStatus) {
      updateData.status = newStatus;
    }

    if (newSpecificStatus && newSpecificStatus !== oldSpecificStatus) {
      updateData.specific_status = newSpecificStatus;
    }

    if (Object.keys(updateData).length > 0) {
      await this.transactionsService.updateByUuid(transaction.uuid, updateData);
    }
  }

  private async runThirdPartyAction(
    transaction: TransactionUnpackedDetailsInterface,
    actionWrapper: ActionWrapperDto,
  ): Promise<any> {
    let url: string =
      `${environment.thirdPartyPaymentsMicroUrl}`
      + `/api/business/${transaction.business_uuid}/integration/${transaction.type}`;

    url = transaction.payment_issuer
      ? `${url}/issuer/${transaction.payment_issuer}/action/${actionWrapper.actionUrl}`
      : `${url}/action/${actionWrapper.actionUrl}`;

    const headers: any = {
      'Accept': 'application/json, text/plain, */*',
      ...RequestDataHelper.prepareHeadersFromWrapper(actionWrapper),
    };

    const config: AxiosRequestConfig = {
      data: actionWrapper.payloadDto,
      headers,
      method: 'POST',
      params: { },
      url: url,
    };

    return this.executeThirdPartyRequest(config, actionWrapper.user);
  }


  private async executeThirdPartyRequest(
    axiosRequestConfig: AxiosRequestConfig,
    originalUser?: UserTokenInterface,
  ): Promise<any> {
    this.logger.log({
      data: axiosRequestConfig.data,
      message: 'Starting third party payment call',
      url: axiosRequestConfig.url,
    });

    const response: Observable<AxiosResponse<any>> =
      await this.intercomService.request(axiosRequestConfig, originalUser);


    return response.pipe(
      map((res: any) => {
        this.logger.log({
          data: axiosRequestConfig.data,
          message: 'Received response from third party payment call',
          response: res.data,
          url: axiosRequestConfig.url,
        });

        return res.data;
      }),
      catchError((error: AxiosError) => {
        this.logger.error({
          data: axiosRequestConfig.data,
          error: error.response.data,
          message: 'Failed response from third party payment call',
          url: axiosRequestConfig.url,
        });

        throw new HttpException(
          error?.response ? error.response : error.message,
          error?.response?.status ? error.response.status : HttpStatus.PRECONDITION_FAILED,
        );
      }),
    ).toPromise();
  }

  private static convertKeysToCamelCase(dto: object): object {
    return _.transform(dto, (r: object, v: any, k: string) => {
      r[_.camelCase(k)] = (typeof v === 'object') ? this.convertKeysToCamelCase(v) : v;
    });
  }
}
