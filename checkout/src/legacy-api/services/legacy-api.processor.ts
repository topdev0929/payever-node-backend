import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  ApiCallResultDto,
  PaymentCreateResultDto,
  ApiCallSuccessDto,
  HeadersHolderDto,
  ApiCallPaymentCreateDto,
  ErrorInfoDto,
  RequestWrapperDto,
  CreatePaymentDto,
} from '../dto';
import { RawRequestInterface } from '../interfaces';
import { PaymentDataHelper } from '../helpers';
import { environment } from '../../environments';
import { EventDispatcher } from '@pe/nest-kit';
import { ValidationError } from 'class-validator';
import { ApiCallService, ChannelSetRetriever, OauthService } from '../../common/services';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';
import { LegacyApiEventEnum, TwoFactorTypeEnum, ActionApiCallStatusEnum } from '../enum';
import { ExternalApiExecutor } from './external-api.executor';
import { CreatePaymentValidator, PaymentMethodVariantValidator } from '../validation';
import { ChannelSetModel } from '../../channel-set/models';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ApiCallModel } from '../../common/models';
import { CreatePaymentWrapperDto as V1CreatePaymentWrapperDto } from '../dto/request/v1';
import { CreatePaymentWrapperDto as V2CreatePaymentWrapperDto } from '../dto/request/v2';
import { CreatePaymentWrapperDto as V3CreatePaymentWrapperDto } from '../dto/request/v3';
import { PaymentOrderValidator } from '../validation/payment-order.validator';
import { CreatePaymentDtoTransformer } from '../transformer/create-payment-dto.transformer';
import { PaymentLinkModel } from '../../payment-links/models';
import { PaymentLinkPrivacyDto } from '../../payment-links/dto';
import { PaymentLinkTransformer } from '../../payment-links/transformers';

@Injectable()
export class LegacyApiProcessor {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetRetriever: ChannelSetRetriever,
    private readonly oauthService: OauthService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly apiCallService: ApiCallService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly createPaymentValidator: CreatePaymentValidator,
    private readonly paymentMethodVariantValidator: PaymentMethodVariantValidator,
    private readonly paymentOrderValidator: PaymentOrderValidator,
    private readonly createPaymentDtoTransformer: CreatePaymentDtoTransformer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async processV1CreatePayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V1CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    const validationResult: ValidationError[] =
      await this.createPaymentValidator.validate(paymentWrapperDto, ['create']);

    if (validationResult && validationResult.length) {
      const errorInfo: ErrorInfoDto =
        await this.createPaymentValidator.getErrorInfo(validationResult, [], paymentWrapperDto.log_level);

      return this.responseTransformer.failedPaymentCreateResponse(
        paymentWrapperDto,
        errorInfo.errors.join('\n'),
        errorInfo.errorCode,
      );
    }

    const commonCreatePaymentDto: CreatePaymentDto =
      CreatePaymentDtoTransformer.v1CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.prepareRedirectUrl(requestWrapper, commonCreatePaymentDto);
  }

  public async processV1SubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V1CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    const validationGroups: string[] = ['submit'];
    if (paymentWrapperDto?.payment_data?.risk_session_id || paymentWrapperDto?.payment_data?.riskSessionId) {
      validationGroups.push('client_ip_required');
    }

    const validationResult: ValidationError[] =
      await this.createPaymentValidator.validate(paymentWrapperDto, validationGroups);
    if (validationResult && validationResult.length) {
      const errorInfo: ErrorInfoDto =
        await this.createPaymentValidator.getErrorInfo(validationResult, [], paymentWrapperDto.log_level);

      return this.responseTransformer.failedPaymentCreateResponse(
        paymentWrapperDto,
        errorInfo.errors.join('\n'),
        errorInfo.errorCode,
      );
    }

    const commonCreatePaymentDto: CreatePaymentDto =
      CreatePaymentDtoTransformer.v1CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.processSubmitPayment(requestWrapper, commonCreatePaymentDto);
  }

  public async processV2CreatePayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V2CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    const validationResult: ValidationError[] = await this.createPaymentValidator.validate(
      paymentWrapperDto,
      this.prepareValidationGroups(paymentWrapperDto, ['create']),
    );

    if (validationResult && validationResult.length) {
      const errorInfo: ErrorInfoDto =
        await this.createPaymentValidator.getErrorInfo(validationResult, [], paymentWrapperDto.log_level);

      return this.responseTransformer.failedPaymentCreateResponse(
        paymentWrapperDto,
        errorInfo.errors.join('\n'),
        errorInfo.errorCode,
      );
    }

    const commonCreatePaymentDto: CreatePaymentDto =
      CreatePaymentDtoTransformer.v2CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.prepareRedirectUrl(requestWrapper, commonCreatePaymentDto);
  }

  public async processCreatePaymentLink(
    requestWrapper: RequestWrapperDto,
    paymentLink: PaymentLinkModel,
    privacyData: PaymentLinkPrivacyDto,
  ): Promise<ApiCallResultDto> {
    if (!paymentLink.channel) {
      paymentLink.channel = 'link';
    }

    const commonCreatePaymentDto: CreatePaymentDto =
      PaymentLinkTransformer.paymentLinkToCommonCreatePayment(paymentLink, privacyData);

    return this.prepareRedirectUrl(requestWrapper, commonCreatePaymentDto, false, true);
  }

  public async processV2SubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V2CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    const validationResult: ValidationError[] = await this.createPaymentValidator.validate(
      paymentWrapperDto,
      this.prepareValidationGroups(paymentWrapperDto, ['submit']),
    );

    if (validationResult && validationResult.length) {
      const errorInfo: ErrorInfoDto =
        await this.createPaymentValidator.getErrorInfo(validationResult, [], paymentWrapperDto.log_level);

      return this.responseTransformer.failedPaymentCreateResponse(
        paymentWrapperDto,
        errorInfo.errors.join('\n'),
        errorInfo.errorCode,
      );
    }

    const commonCreatePaymentDto: CreatePaymentDto =
      CreatePaymentDtoTransformer.v2CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.processSubmitPayment(requestWrapper, commonCreatePaymentDto);
  }

  public async processV2CreateOrSubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V2CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    if (paymentWrapperDto?.payment_data?.force_redirect !== true) {
      return this.processV2CreatePayment(requestWrapper, paymentWrapperDto);
    }

    const submitResult: ApiCallResultDto = await this.processV2SubmitPayment(requestWrapper, paymentWrapperDto);

    return this.prepareRedirectUrlFromSubmit(submitResult);
  }

  public async processV3CreateOrSubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V3CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    if (paymentWrapperDto?.payment_data?.force_redirect !== true) {
      return this.processV3CreatePayment(requestWrapper, paymentWrapperDto);
    }

    const submitResult: ApiCallResultDto = await this.processV3SubmitPayment(requestWrapper, paymentWrapperDto);

    return this.prepareRedirectUrlFromSubmit(submitResult, paymentWrapperDto?.options?.use_iframe);
  }

  public async processV3CreatePayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V3CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    await this.paymentOrderValidator.validate(paymentWrapperDto, requestWrapper.user);
    await this.createPaymentValidator.validateAndThrowError(
      paymentWrapperDto,
      this.prepareValidationGroups(paymentWrapperDto, ['create']),
    );

    const commonCreatePaymentDto: CreatePaymentDto =
      await this.createPaymentDtoTransformer.v3CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.prepareRedirectUrl(requestWrapper, commonCreatePaymentDto, true);
  }

  public async processV3SubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentWrapperDto: V3CreatePaymentWrapperDto,
  ): Promise<ApiCallResultDto> {
    if (!paymentWrapperDto.device) {
      paymentWrapperDto.device = { };
    }

    if (paymentWrapperDto.client_ip && !paymentWrapperDto.device?.client_ip) {
      paymentWrapperDto.device.client_ip = paymentWrapperDto.client_ip;
    }

    if (paymentWrapperDto.device?.client_ip && !paymentWrapperDto.client_ip) {
      paymentWrapperDto.client_ip = paymentWrapperDto.device.client_ip;
    }

    await this.paymentOrderValidator.validate(paymentWrapperDto, requestWrapper.user);
    await this.createPaymentValidator.validateAndThrowError(
      paymentWrapperDto,
      this.prepareValidationGroups(paymentWrapperDto, ['submit']),
    );

    const commonCreatePaymentDto: CreatePaymentDto =
      await this.createPaymentDtoTransformer.v3CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto);

    return this.processSubmitPayment(requestWrapper, commonCreatePaymentDto);
  }

  private async processSubmitPayment(
    requestWrapper: RequestWrapperDto,
    paymentDto: CreatePaymentDto,
    throwException: boolean = false,
  ): Promise<ApiCallResultDto> {
    const executionStartTime: [number, number] = process.hrtime();
    const extraBusinessId: string =
      PaymentDataHelper.extractBusinessIdFromPaymentDto(paymentDto) || requestWrapper.targetBusinessId;
    const businessId: string = this.oauthService.getOauthUserBusiness(requestWrapper.user, extraBusinessId);

    if (extraBusinessId && extraBusinessId !== businessId) {
      throw new ForbiddenException(`You're not allowed to create payment with business id ${extraBusinessId}`);
    }

    if (!paymentDto.payment_data) {
      paymentDto.payment_data = { };
    }

    try {
      if (requestWrapper.user.clientId) {
        paymentDto.client_id = requestWrapper.user.clientId;
      }

      if (!paymentDto.payment_data?.frontendCancelUrl) {
        paymentDto.payment_data.frontendCancelUrl = paymentDto.cancel_url || paymentDto.customer_redirect_url;
      }

      if (!paymentDto.payment_data?.frontendFailureUrl) {
        paymentDto.payment_data.frontendFailureUrl = paymentDto.failure_url || paymentDto.customer_redirect_url;
      }

      if (!paymentDto.payment_data?.frontendFinishUrl) {
        paymentDto.payment_data.frontendFinishUrl = paymentDto.success_url || paymentDto.customer_redirect_url;
      }

      if (!paymentDto.payment_data?.frontendSuccessUrl) {
        paymentDto.payment_data.frontendSuccessUrl = paymentDto.success_url || paymentDto.customer_redirect_url;
      }

      await this.paymentMethodVariantValidator.validate(paymentDto, businessId);
      const createdApiCall: ApiCallModel =
        await this.apiCallService.createApiCallFromCommonCreatePaymentRequestDto(businessId, paymentDto);

      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(requestWrapper.request);

      const submitResult: ApiCallResultDto = await this.externalApiExecutor.externalSubmitPayment(
        paymentDto,
        headersHolder,
        businessId,
        createdApiCall,
      );

      const executionEndTime: [number, number] = process.hrtime(executionStartTime);
      const preparedExecutionTime: string = `${executionEndTime[0]}s ${executionEndTime[1] / 1000000}ms`;
      await this.apiCallService.updateApiCallWithExecutionTime(createdApiCall, preparedExecutionTime);

      return submitResult;
    } catch (e) {
      if (throwException) {
        throw e;
      }

      return this.responseTransformer.failedThirdPartyPaymentSubmitResponse(paymentDto, e.message);
    }
  }

  private async prepareRedirectUrl(
    requestWrapper: RequestWrapperDto,
    paymentDto: CreatePaymentDto,
    throwException: boolean = false,
    fillCallbackUrlsFromCheckout: boolean = false,
  ): Promise<ApiCallResultDto> {
    const executionStartTime: [number, number] = process.hrtime();
    const extraBusinessId: string =
      PaymentDataHelper.extractBusinessIdFromPaymentDto(paymentDto) || requestWrapper.targetBusinessId;
    const businessId: string = this.oauthService.getOauthUserBusiness(requestWrapper.user, extraBusinessId);

    if (extraBusinessId && extraBusinessId !== businessId) {
      throw new ForbiddenException(`You're not allowed to create payment with business id ${extraBusinessId}`);
    }

    try {
      if (requestWrapper.user.clientId) {
        paymentDto.client_id = requestWrapper.user.clientId;
      }

      await this.paymentMethodVariantValidator.validate(paymentDto, businessId);

      let createdApiCall: ApiCallModel =
        await this.apiCallService.createApiCallFromCommonCreatePaymentRequestDto(businessId, paymentDto);

      const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
      const channelSet: ChannelSetModel =
        await this.channelSetRetriever.getChannelSetFromApiCall(createdApiCall, business);
      const locale: string =
        await this.apiCallService.guessLocale(createdApiCall);

      if (fillCallbackUrlsFromCheckout) {
        createdApiCall = await this.apiCallService.updateApiCallWithCallbackUrls(createdApiCall, channelSet);
      }

      const redirectUrl: string =
        `${environment.frontendCheckoutWrapperMicroUrl}/${locale}/pay/api-call/` +
        `${createdApiCall.id}?channelSetId=${channelSet.id}`;

      const paymentCreateResultDto: PaymentCreateResultDto =
        await this.responseTransformer.successPaymentCreateResponse(
          createdApiCall,
          redirectUrl,
          paymentDto,
        );

      await this.eventDispatcher.dispatch(
        LegacyApiEventEnum.createPaymentRequested,
        paymentCreateResultDto.call,
        redirectUrl,
        businessId,
        channelSet.id,
      );

      const executionEndTime: [number, number] = process.hrtime(executionStartTime);
      const preparedExecutionTime: string = `${executionEndTime[0]}s ${executionEndTime[1] / 1000000}ms`;
      await this.apiCallService.updateApiCallWithExecutionTime(createdApiCall, preparedExecutionTime);

      return paymentCreateResultDto;
    } catch (e) {
      this.logger.log(
        {
          bodyDto: paymentDto,
          businessId: businessId,
          error: e.message,
          extraBusinessId: extraBusinessId,
          headers: requestWrapper.request.headers,
          message: `Error occurred on payment create api call for business id ${businessId}`,
          paymentDto: paymentDto,
          requestBody: (requestWrapper.request.raw as RawRequestInterface).body,
          requestRawBody: (requestWrapper.request.raw as RawRequestInterface).body,
        },
      );

      if (throwException) {
        throw e;
      }

      return this.responseTransformer.failedPaymentCreateResponse(paymentDto, e.message);
    }
  }

  private async prepareRedirectUrlFromSubmit(
    submitResult: ApiCallResultDto,
    useIframe?: boolean,
  ): Promise<ApiCallResultDto> {
    let apiCallResultDto: ApiCallResultDto = submitResult;
    if (submitResult.call.status === ActionApiCallStatusEnum.success) {
      const apiCallSuccessDto: ApiCallSuccessDto = plainToClass(ApiCallSuccessDto, submitResult);

      const apiCallCreatedDto: ApiCallPaymentCreateDto = {
        ...submitResult.call,
        ...apiCallSuccessDto.result,
      };
      const redirectUrl: string = apiCallSuccessDto.result?.payment_details?.redirectUrl;

      apiCallResultDto =
        useIframe
          ? this.responseTransformer.prepareIframeResponse(apiCallCreatedDto, redirectUrl)
          : {
            call: apiCallCreatedDto,
            redirect_url: redirectUrl,
          } as ApiCallResultDto;
    }

    return apiCallResultDto;
  }

  private prepareValidationGroups(
    paymentWrapperDto: V2CreatePaymentWrapperDto | V3CreatePaymentWrapperDto,
    groups: string[],
  ): string[] {
    if (paymentWrapperDto.verify?.two_factor === TwoFactorTypeEnum.email) {
      groups.push('two_factor_email');
    }

    if (paymentWrapperDto.verify?.two_factor === TwoFactorTypeEnum.sms) {
      groups.push('two_factor_sms');
    }

    if (paymentWrapperDto?.payment_data?.risk_session_id || paymentWrapperDto?.payment_data?.riskSessionId) {
      groups.push('client_ip_required');
    }

    if (paymentWrapperDto?.order_id) {
      groups.push('has_order');
    }

    return groups;
  }
}
