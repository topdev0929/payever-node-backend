import {
  HttpException,
  HttpStatus,
  HttpService,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IntercomService } from '@pe/nest-kit';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusinessModel } from '../../business/models';
import { ChannelSetModel } from '../../channel-set/models';
import { ConnectionModel } from '../../connection/models';
import { CheckoutConnectionService } from '../../connection/services';
import { environment } from '../../environments';
import {
  ActionWrapperDto,
  ApiCallResultDto,
  HeadersHolderDto,
  RiskSessionIdResponseDto,
  ThirdPartyPaymentSubmitWrapperResponseDto,
  TransactionHistoryDto,
  TransactionHistoryQueryDto,
} from '../dto';
import { ExternalApiEndpointsEnum, VerifyTypeEnum } from '../enum';
import { ThirdPartyCompanySearchInterface, ThirdPartyPaymentSubmitInterface } from '../interfaces';
import { PaymentCodeModel, PaymentModel } from '../models';
import { B2bTransformer, PaymentSubmitDtoTransformer } from '../transformer';
import { plainToClass } from 'class-transformer';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';
import { PaymentCodeService } from './payment-code.service';
import { ChannelSetRetriever } from '../../common/services';
import { ApiCallModel } from '../../common/models';
import { PaymentActionDto } from '../dto/payment-action.dto';
import * as queryString from 'querystring';
import { CreatePaymentDto } from '../dto/request/common';
import {
  AttachPurchaserAddressRequestDto,
  CompanyCreditLineRequestDto,
  CompanySearchRequestDto,
  DeactivatePurchaserRequestDto,
  DeletePurchaserRequestDto,
  OnboardPurchaserRequestDto,
  TriggerPurchaserVerificationRequestDto,
  UpdatePurchaserRequestDto,
} from '../dto/request/v1';
import * as _ from 'lodash';
import { PaymentDataHelper } from '../helpers';

@Injectable()
export class ThirdPartyExternalPaymentCaller {
  constructor(
    private readonly intercomService: IntercomService,
    private readonly httpService: HttpService,
    private readonly channelSetRetriever: ChannelSetRetriever,
    private readonly checkoutConnectionService: CheckoutConnectionService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly paymentCodeService: PaymentCodeService,
    private readonly logger: Logger,
  ) { }

  public async doSubmitPayment(
    submitPaymentDto: CreatePaymentDto,
    headersHolder: HeadersHolderDto,
    business: BusinessModel,
    apiCall: ApiCallModel,
  ): Promise<ApiCallResultDto> {
    const channelSet: ChannelSetModel = await this.channelSetRetriever.getChannelSetFromApiCall(apiCall, business);
    if (!channelSet) {
      const channelTypeString: string =
        apiCall.channel_type ? `${apiCall.channel}/${apiCall.channel_type}` : apiCall.channel;
      throw new NotFoundException(
        `Channel set of type "${channelTypeString}" not found for business "${business.id}"`,
      );
    }

    const submitTPPMDto: ThirdPartyPaymentSubmitInterface =
      PaymentSubmitDtoTransformer.submitDtoToTPPMDto(submitPaymentDto, apiCall, business, channelSet);

    let connectionId: string = apiCall.variant_id;
    if (!connectionId) {
      await channelSet.populate('checkout').execPopulate();
      const checkoutConnections: ConnectionModel[] =
        await this.checkoutConnectionService.getInstalledConnections(channelSet.checkout, business);

      const submitConnection: ConnectionModel =
        checkoutConnections.find((
          connection: ConnectionModel,
        ) => connection.integration.name === apiCall.payment_method);

      if (!submitConnection) {
        throw new NotFoundException(`Connection not found for payment method "${apiCall.payment_method}"`);
      }

      connectionId = submitConnection.id;
    }

    let verifyCode: number;
    if (apiCall.verify_type && apiCall.verify_type === VerifyTypeEnum.code) {
      const paymentCode: PaymentCodeModel = await this.paymentCodeService.getPaymentCodeByApiCall(apiCall);
      verifyCode = paymentCode?.code;
    }

    const submitPaymentUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connectionId}/action/pay`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      submitPaymentUrl,
      submitTPPMDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        const paymentSubmitResponse: ThirdPartyPaymentSubmitWrapperResponseDto =
          plainToClass<ThirdPartyPaymentSubmitWrapperResponseDto, any>(
            ThirdPartyPaymentSubmitWrapperResponseDto,
            res.data,
          );

        return this.responseTransformer.successThirdPartyPaymentSubmitResponse(
          paymentSubmitResponse,
          apiCall,
          verifyCode,
        );
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedThirdPartyPaymentSubmitResponse(
          submitPaymentDto,
          error.response.data.message,
        ));
      }),
    ).toPromise();
  }

  public async doFinanceExpressPayment(
    submitPaymentDto: any,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ThirdPartyPaymentSubmitWrapperResponseDto> {
    const submitPaymentUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/pay`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      submitPaymentUrl,
      submitPaymentDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return plainToClass<ThirdPartyPaymentSubmitWrapperResponseDto, any>(
            ThirdPartyPaymentSubmitWrapperResponseDto,
            res.data,
          );
      }),
      catchError((error: AxiosError) => {
        throw new HttpException(
          error.response.data || error.message,
          error.response.status || HttpStatus.PRECONDITION_FAILED,
        );
      }),
    ).toPromise();
  }

  public async getRiskSessionId(
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const riskSessionUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/get-risk-session-id`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      riskSessionUrl,
      { },
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        const riskResponse: RiskSessionIdResponseDto = plainToClass<RiskSessionIdResponseDto, any>(
          RiskSessionIdResponseDto,
          res.data,
        );

        return this.responseTransformer.successRiskSessionIdResponse(riskResponse);
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'risk',
        ));
      }),
    ).toPromise();
  }

  public async searchCompany(
    companySearchRequestDto: CompanySearchRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const companySearchUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/company-search`;

    const requestDto: ThirdPartyCompanySearchInterface =
      B2bTransformer.companySearchDtoToTPPMDto(companySearchRequestDto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      companySearchUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'search',
        ));
      }),
    ).toPromise();
  }

  public async transactionDataByPaymentId(
    data: any,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const transactionDataUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/transaction-data`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      transactionDataUrl,
      data,
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'transaction-data',
        ));
      }),
    ).toPromise();
  }

  public async transactionDataByBusinessId(
    data: any,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const transactionDataUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/business-transaction-data`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      transactionDataUrl,
      data,
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'transaction-data',
        ));
      }),
    ).toPromise();
  }

  public async paymentPreInitialization(
    preInitDto: any,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const preInitUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/${ExternalApiEndpointsEnum.paymentPreInitialize}`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      preInitUrl,
      preInitDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        throw new HttpException(
          error.response.data || error.message,
          error.response.status || HttpStatus.PRECONDITION_FAILED,
        );
      }),
    ).toPromise();
  }

  public async getCompanyCreditLine(
    companyCreditLineRequestDto: CompanyCreditLineRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const companyCreditLineUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/get-company-credit-line`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      companyCreditLineUrl,
      {
        externalId: companyCreditLineRequestDto?.company?.external_id,
      },
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'credit',
        ));
      }),
    ).toPromise();
  }

  public async onboardPurchaser(
    dto: OnboardPurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/onboard-purchaser`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async updatePurchaser(
    dto: UpdatePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/update-purchaser`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async deletePurchaser(
    dto: DeletePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/delete-purchaser`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async deactivatePurchaser(
    dto: DeactivatePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/deactivate-purchaser`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async attachPurchaserAddress(
    dto: AttachPurchaserAddressRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/attach-address`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async triggerPurchaserVerification(
    dto: TriggerPurchaserVerificationRequestDto,
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<ApiCallResultDto> {
    const onboardPurchaserUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/${ExternalApiEndpointsEnum.triggerPurchaserVerification}`;

    const requestDto: any = ThirdPartyExternalPaymentCaller.convertKeysToCamelCase(dto);

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      onboardPurchaserUrl,
      requestDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'onboarding',
        ));
      }),
    ).toPromise();
  }

  public async getExternalTerms(
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
  ): Promise<any> {
    const termsUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/get-terms`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      termsUrl,
      { },
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response?.data?.message,
          'terms',
        ));
      }),
    ).toPromise();
  }

  public async getRates(
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
    queryDto: any,
  ): Promise<ApiCallResultDto> {
    const getRatesUrl: string = `${environment.thirdPartyPaymentsMicroUrl}`
      + `/connection/${connection.id}/action/calculate-rates`;

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      getRatesUrl,
      queryDto,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, true),
      },
    );

    return response.pipe(
      map((res: any) => {
        return this.responseTransformer.successRatesResponse(res.data);
      }),
      catchError((error: AxiosError) => {
        return of(this.responseTransformer.failedCustomErrorResponse(
          error.response.data.message,
          'rates',
        ));
      }),
    ).toPromise();
  }

  public async executeAction(
    payment: PaymentModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<PaymentActionDto> {
    const doActionUrl: string =
      `${environment.transactionsMicroUrl}`
      + `/business/${payment.business_uuid}`
      + `/${payment.uuid}`
      + `/legacy-api-action/${actionWrapper.action}`
    ;

    this.logger.log(
      {
        action: actionWrapper.action,
        actionUrl: doActionUrl,
        message: `Starting external action call for payment id ${payment.original_id}`,
        postDto: actionWrapper.payloadDto,
      },
    );

    const response: any = this.httpService.post(
      `${doActionUrl}`,
      {
        fields: actionWrapper.payloadDto,
      },
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(actionWrapper, false),
      },
    );

    return response.pipe(
      map((apiResponse: AxiosResponse<any>) => {
        this.logger.log(
          {
            action: actionWrapper.action,
            actionUrl: doActionUrl,
            message: `Received response from external action call for payment id ${payment.original_id}`,
            postDto: actionWrapper.payloadDto,
            response: JSON.stringify(apiResponse.data),
          },
        );

        return plainToClass<PaymentActionDto, { }>(PaymentActionDto, apiResponse.data);
      }),
      catchError((e: any) => {
        this.logger.log(
          {
            action: actionWrapper.action,
            actionUrl: doActionUrl,
            error: e.message,
            errorResponseData: JSON.stringify(e.response?.data ? e.response?.data : { }),
            message: `Received error from external action call for payment id ${payment.original_id}`,
            postDto: actionWrapper.payloadDto,
          },
        );
        const message: string = e.response?.data
          ? (e.response.data.message ? e.response.data.message : e.response.data.error)
          : e.message;

        throw new HttpException(message, HttpStatus.PRECONDITION_FAILED);
      }),
    ).toPromise();
  }

  public async getTransactionHistory(
    headersHolder: HeadersHolderDto,
    payment: PaymentModel,
    action: string,
    limit: number,
  ): Promise<TransactionHistoryDto[]> {
    let historyUrl: string =
      `${environment.transactionsMicroUrl}`
      + `/business/${payment.business_uuid}`
      + `/transaction/${payment.uuid}`
      + `/history/${action}`;

    if (limit) {
      historyUrl += `?limit=${limit}`;
    }

    return this.doTransactionsHistoryRequest(headersHolder, historyUrl);
  }

  public async getRecentTransactionHistoryEntries(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentId: string,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {
    const historyUrl: string =
      `${environment.transactionsMicroUrl}`
      + `/business/${businessId}`
      + `/transaction/${paymentId}`
      + `/history`;

    return this.doTransactionsHistoryRequest(headersHolder, historyUrl, queryDto);
  }

  public async getRecentTransactionHistory(
    headersHolder: HeadersHolderDto,
    businessId: string,
    action: string,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {
    const historyUrl: string =
      `${environment.transactionsMicroUrl}`
      + `/business/${businessId}`
      + `/history/${action}`;

    return this.doTransactionsHistoryRequest(headersHolder, historyUrl, queryDto);
  }

  private async doTransactionsHistoryRequest(
    headersHolder: HeadersHolderDto,
    url: string,
    queryDto?: TransactionHistoryQueryDto,
  ): Promise<any> {
    const historyUrl: string = queryDto ? ThirdPartyExternalPaymentCaller.prepareQueryParams(url, queryDto) : url;

    const response: any = this.httpService.get(
      `${historyUrl}`,
      {
        headers: ThirdPartyExternalPaymentCaller.prepareHeaders(headersHolder, false),
      },
    );

    return response.pipe(
      map((apiResponse: AxiosResponse<any>) => {
        return apiResponse.data;
      }),
      catchError((e: any) => {
        const message: string = e.response?.data
          ? (e.response.data.message ? e.response.data.message : e.response.data.error)
          : e.message;

        throw new HttpException(message, HttpStatus.PRECONDITION_FAILED);
      }),
    ).toPromise();
  }

  private static prepareHeaders(
    headersHolder: HeadersHolderDto,
    isIntercom: boolean,
  ): object {
    return PaymentDataHelper.prepareHeadersFromHolder(headersHolder, isIntercom);
  }

  private static prepareQueryParams(url: string, queryDto: TransactionHistoryQueryDto): string {
    for (const key in queryDto) {
      if (!queryDto[key]) {
        delete queryDto[key];
      }
    }
    const query: string = queryString.stringify(queryDto as queryString.ParsedUrlQueryInput);

    if (query) {
      url += `?${query}`;
    }

    return url;
  }

  private static convertKeysToCamelCase(dto: object): object {
    return _.transform(dto, (r: object, v: any, k: string) => {
      r[_.camelCase(k)] = (typeof v === 'object') ? this.convertKeysToCamelCase(v) : v;
    });
  }
}
