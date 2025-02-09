/* eslint-disable @typescript-eslint/tslint/config */
/* eslint max-len: ["error", { "ignoreTemplateLiterals": true, "code": 120 }] */
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { BusinessModel } from '../../business';
import { ChannelSetModel } from '../../channel-set';
import {
  ApiCallBusinessListChannelSetsDto,
  ApiCallBusinessListPaymentOptionsDto,
  ApiCallFailedDto,
  ApiCallPaymentCreateDto,
  ApiCallPaymentListDto,
  ApiCallPaymentRetrieveDto,
  ApiCallPaymentSubmitFailedDto,
  ApiCallSuccessDto,
  ChannelSetDto,
  PaymentCreateResultDto,
  PaymentResultDto,
  ThirdPartyPaymentAddressResponseDto,
  ThirdPartyPaymentInfoResponseDto,
  ThirdPartyPaymentSubmitWrapperResponseDto,
  ApiCallBusinessListPaymentMethodsDto,
  PaymentCodeResponseDto,
  ApiCallPaymentSubmitSuccessDto,
  ApiCallBusinessPaymentMethodLimitsDto,
  PaymentMethodLimitsDto,
  RiskSessionIdResponseDto,
  TransactionHistoryDto,
} from '../dto';
import { ApiCallPaymentActionDto } from '../dto/response/api-call-payment-action.dto';
import { PaymentMethodDto } from '../dto/response/payment-method.dto';
import { ApiCallResponseInterface, TermsInterface } from '../interfaces';
import { PaymentCodeModel, PaymentModel } from '../models';
import { PaymentMethodResponseDto } from '../dto/response/payment-method-response.dto';
import * as QRCode from 'qrcode';
import { ChannelSubTypeEnum } from '../enum';
import { ApiCallModel } from '../../common/models';
import { PaymentListFilterDto } from '../dto/request/v1';
import { CreatePaymentDto } from '../dto/request/common';
import { ErrorCodeType } from '@pe/nest-kit/modules/errors-handler/types/error-code.type';

@Injectable()
export class LegacyApiResponseTransformerService {
  public successBusinessChannelSetsResponse(
    business: BusinessModel,
    result: ChannelSetDto[],
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallBusinessListChannelSetsDto =
      new ApiCallBusinessListChannelSetsDto(business);

    return this.prepareApiCallSuccessDTO(apiCallSuccess, result);
  }

  public failedBusinessChannelSetsResponse(
    business: BusinessModel,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallBusinessListChannelSetsDto =
      new ApiCallBusinessListChannelSetsDto(business, 'failed');

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successBusinessPaymentOptionsResponse(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    result: PaymentMethodDto[],
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallBusinessListPaymentOptionsDto =
      new ApiCallBusinessListPaymentOptionsDto(business, channelSet);

    return this.prepareApiCallSuccessDTO(apiCallSuccess, result);
  }

  public failedBusinessPaymentOptionsResponse(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallBusinessListPaymentOptionsDto =
      new ApiCallBusinessListPaymentOptionsDto(business, channelSet, 'failed');

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successBusinessPaymentMethodsResponse(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    result: PaymentMethodDto[] | PaymentMethodResponseDto[],
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallBusinessListPaymentMethodsDto =
      new ApiCallBusinessListPaymentMethodsDto(business, channelSet);

    return this.prepareApiCallSuccessDTO(apiCallSuccess, result);
  }

  public failedBusinessPaymentMethodsResponse(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallBusinessListPaymentMethodsDto =
      new ApiCallBusinessListPaymentMethodsDto(business, channelSet, 'failed');

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successBusinessPaymentMethodLimitsResponse(
    business: BusinessModel,
    result: PaymentMethodLimitsDto,
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallBusinessPaymentMethodLimitsDto =
      new ApiCallBusinessPaymentMethodLimitsDto(business);

    return this.prepareApiCallSuccessDTO(apiCallSuccess, result);
  }

  public failedBusinessPaymentMethodLimitsResponse(
    business: BusinessModel,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallBusinessPaymentMethodLimitsDto =
      new ApiCallBusinessPaymentMethodLimitsDto(business, null, 'failed');

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successPaymentResponse(payment: PaymentModel, history?: TransactionHistoryDto[]): ApiCallSuccessDto {
    return this.prepareApiCallSuccessDTO(
      new ApiCallPaymentRetrieveDto(),
      this.paymentToResponseDTO(payment, history),
    );
  }

  public async successPaymentCreateResponse(
    apiCallCreate: ApiCallModel,
    redirectUrl: string,
    paymentDto: CreatePaymentDto,
  ): Promise<PaymentCreateResultDto> {
    let apiCallCreateDto: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallCreateDto
      .setId(apiCallCreate.id)
      .setCreatedAt(new Date())
      .setStatus('new')
      .setType('create');

    apiCallCreateDto = { ...apiCallCreateDto, ...paymentDto } as ApiCallPaymentCreateDto;

    apiCallCreateDto.cart = apiCallCreateDto.cart ? apiCallCreateDto.cart : undefined;
    apiCallCreateDto.shipping_address = apiCallCreate.shipping_address;
    apiCallCreateDto = this.removeExtraFields(apiCallCreateDto, paymentDto);

    if (apiCallCreate.channel_type === ChannelSubTypeEnum.Qr) {
      const qrCodeBase64: string = await QRCode.toDataURL(redirectUrl);

      return {
        call: apiCallCreateDto,
        qr_code: qrCodeBase64,
      } as PaymentCreateResultDto;
    }

    if ([ChannelSubTypeEnum.Email, ChannelSubTypeEnum.Sms].includes(apiCallCreate.channel_type as ChannelSubTypeEnum)) {
      return {
        call: apiCallCreateDto,
      } as PaymentCreateResultDto;
    }

    if (apiCallCreate.use_iframe) {
      return this.prepareIframeResponse(apiCallCreateDto, redirectUrl);
    }

    return {
      call: apiCallCreateDto,
      redirect_url: redirectUrl,
    } as PaymentCreateResultDto;
  }

  public failedPaymentCreateResponse(
    paymentDto: any,
    errorMessage: string,
    errorCode?: ErrorCodeType,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallFailed
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('failed')
      .setType('create');

    return this.prepareApiCallFailedDTO({ ...apiCallFailed, ...paymentDto }, errorMessage, errorCode);
  }

  public successThirdPartyPaymentSubmitResponse(
    thirdPartyPaymentSubmitResponse: ThirdPartyPaymentSubmitWrapperResponseDto,
    apiCall: ApiCallModel,
    verifyCode: number,
  ): ApiCallSuccessDto {
    const payment: ThirdPartyPaymentInfoResponseDto = thirdPartyPaymentSubmitResponse.payment;
    const address: ThirdPartyPaymentAddressResponseDto = payment.address;
    const shippingAddress: ThirdPartyPaymentAddressResponseDto = payment.shippingAddress;

    const paymentResultDto: PaymentResultDto = {
      payment_details: thirdPartyPaymentSubmitResponse.paymentDetails as [],
      address: {
        address_line_2: address.addressLine2,
        email: address.email,
        salutation: address.salutation,
        city: address.city,
        street: address.street,
        street_number: address.streetNumber,
        country: address.country,
        phone: address.phone,
        first_name: address.firstName,
        last_name: address.lastName,
        zip_code: address.zipCode,
        region: address.region,
      },
      amount: payment.amount,
      channel: payment.channel,
      channel_type: payment.channelType,
      channel_source: payment.channelSource,
      created_at: thirdPartyPaymentSubmitResponse.createdAt,
      currency: payment.currency,
      customer_email: payment.customerEmail,
      customer_name: payment.customerName,
      delivery_fee: payment.deliveryFee,
      down_payment: payment.downPayment,
      id: thirdPartyPaymentSubmitResponse.id,
      merchant_name: payment.businessName,
      payment_fee: payment.paymentFee,
      payment_issuer: payment.paymentIssuer,
      payment_type: payment.paymentType,
      reference: payment.reference,
      specific_status: payment.specificStatus,
      status: payment.status,
      total: payment.total,
    } as PaymentResultDto;

    if (shippingAddress) {
      paymentResultDto.shipping_address = {
        address_line_2: shippingAddress.addressLine2,
        salutation: shippingAddress.salutation,
        city: shippingAddress.city,
        street: shippingAddress.street,
        country: shippingAddress.country,
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        zip_code: shippingAddress.zipCode,
        region: shippingAddress.region,
      };
    }

    return this.prepareApiCallSuccessDTO(
      new ApiCallPaymentSubmitSuccessDto(apiCall.id, verifyCode),
      paymentResultDto,
    );
  }

  public failedThirdPartyPaymentSubmitResponse(
    submitPaymentDto: CreatePaymentDto,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallPaymentSubmitFailedDto = new ApiCallPaymentSubmitFailedDto();

    apiCallFailed
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('failed')
      .setType('submit');

    return this.prepareApiCallFailedDTO({ ...apiCallFailed, ...submitPaymentDto }, errorMessage);
  }

  public successRiskSessionIdResponse(riskSessionIdDto: RiskSessionIdResponseDto): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallSuccess
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('success')
      .setType('risk');

    return this.prepareApiCallSuccessDTO(apiCallSuccess, riskSessionIdDto);
  }

  public successRatesResponse(ratesResponse: any): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallSuccess
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('success')
      .setType('rates');

    return this.prepareApiCallSuccessDTO(apiCallSuccess, ratesResponse);
  }

  public successTermsResponse(
    terms: TermsInterface,
    externalTerms?: any,
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallSuccess
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('success')
      .setType('terms');

    return this.prepareApiCallSuccessDTO(
      apiCallSuccess,
      terms
        ? (externalTerms ? externalTerms : {
            form: terms.form,
            legal_text: terms.legal_text,
          })
        : { },
    );
  }

  public failedCustomErrorResponse(errorMessage: string, type: string): ApiCallFailedDto {
    const apiCallFailed: ApiCallPaymentCreateDto = new ApiCallPaymentCreateDto();

    apiCallFailed
      .setId(createHash('md5').update(uuid()).digest('hex'))
      .setCreatedAt(new Date())
      .setStatus('failed')
      .setType(type);

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successPaymentListResponse(filterDTO: PaymentListFilterDto, paymentsList: PaymentModel[]): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallPaymentListDto = new ApiCallPaymentListDto(filterDTO);
    const result: PaymentResultDto[] = paymentsList.map((payment: PaymentModel) => this.paymentToResponseDTO(payment));

    return this.prepareApiCallSuccessDTO(apiCallSuccess, result);
  }

  public failedPaymentListResponse(
    filterDTO: PaymentListFilterDto,
    businessId: string,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallResponseInterface = {
      ...(new ApiCallPaymentListDto(filterDTO, 'failed')),
      business_id: businessId,
    } as ApiCallResponseInterface;

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public successPaymentActionResponse(
    payment: PaymentModel,
    action: string,
    actionDto: object,
    requires2FA: boolean = false,
  ): ApiCallSuccessDto {
    const apiCallSuccess: ApiCallResponseInterface = {
      ...(new ApiCallPaymentActionDto(payment, action, 'success', requires2FA)),
      ...actionDto,
    } as ApiCallResponseInterface;

    return this.prepareApiCallSuccessDTO(
      apiCallSuccess,
      this.paymentToResponseDTO(payment),
    );
  }

  public failedPaymentActionResponse(
    payment: PaymentModel,
    action: string,
    actionDto: object,
    errorMessage: string,
  ): ApiCallFailedDto {
    const apiCallFailed: ApiCallResponseInterface = {
      ...(new ApiCallPaymentActionDto(payment, action, 'failed')),
      ...actionDto,
    } as ApiCallResponseInterface;

    return this.prepareApiCallFailedDTO(apiCallFailed, errorMessage);
  }

  public prepareApiCallSuccessDTO(apiCall: ApiCallResponseInterface, result: object): ApiCallSuccessDto {
    return {
      call: apiCall,
      result: result,
    } as ApiCallSuccessDto;
  }

  public prepareApiCallFailedDTO(
    apiCall: ApiCallResponseInterface,
    error: string,
    errorCode?: ErrorCodeType,
  ): ApiCallFailedDto {
    return {
      call:  {
        ...apiCall,
        message: error,
      },
      error_code: errorCode,
      error: 'An api error occurred',
      error_description: error,
    } as ApiCallFailedDto;
  }

  public paymentToResponseDTO(payment: PaymentModel, history?: TransactionHistoryDto[]): PaymentResultDto {
    const resultDto: PaymentResultDto = plainToClass<PaymentResultDto, PaymentModel>(PaymentResultDto, payment);
    resultDto.setPaymentDetailsArray(resultDto.payment_details);
    resultDto.history = history;

    return resultDto;
  }

  public preparePaymentCodeResponse(paymentCode: PaymentCodeModel): PaymentCodeResponseDto {
    return {
      apiCallId: paymentCode.apiCallId,
      businessId: paymentCode.businessId,
      code: paymentCode.code,
    };
  }

  public prepareIframeResponse(
    apiCallCreateDto: ApiCallPaymentCreateDto,
    redirectUrl: string,
  ): PaymentCreateResultDto {
    const iframeCode: string = `<iframe width="100%" id="payever_iframe" sandbox=" allow-same-origin allow-forms allow-top-navigation allow-scripts allow-modals allow-popups allow-popups-to-escape-sandbox" frameborder="0" style="border:none;" src="${redirectUrl}"></iframe>`;

    return {
      call: apiCallCreateDto,
      iframe: iframeCode,
    } as PaymentCreateResultDto;
  }

  public prepareCreatePaymentLinkResponse(
    createPayment: CreatePaymentDto,
    paymentLinkResult: any,
    redirectUrl: string,
  ): any {
    return {
      call: createPayment,
      redirect_url: redirectUrl,
      result: paymentLinkResult,
    };
  }

  private removeExtraFields(
    apiCallPaymentCreate: ApiCallPaymentCreateDto,
    createPayment: CreatePaymentDto,
  ): ApiCallPaymentCreateDto {
    if (createPayment.fee === undefined) {
      delete apiCallPaymentCreate.fee;
    }
    if (createPayment.allow_cart_step === undefined) {
      delete apiCallPaymentCreate.allow_cart_step;
    }
    if (createPayment.use_inventory === undefined) {
      delete apiCallPaymentCreate.use_inventory;
    }
    if (createPayment.verify_two_factor === undefined) {
      delete apiCallPaymentCreate.verify_two_factor;
    }
    if (createPayment.cart === undefined) {
      delete apiCallPaymentCreate.cart;
    }

    delete apiCallPaymentCreate.original_cart;
    delete apiCallPaymentCreate.client_id;

    return apiCallPaymentCreate;
  }
}
