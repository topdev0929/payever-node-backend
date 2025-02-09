import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ActionWrapperDto,
  ApiCallResultDto,
  HeadersHolderDto,
  TransactionHistoryDto,
  TransactionHistoryQueryDto,
} from '../dto';
import { ThirdPartyExternalPaymentCaller } from './third-party-external-payment.caller';
import { ConnectionModel } from '../../connection/models';
import { ApiCallModel, PaymentMethodMigrationMappingModel } from '../../common/models';
import { PaymentModel } from '../models';
import { PaymentActionDto } from '../dto/payment-action.dto';
import { AllowedApiEndpointsPaymentMethods, ExternalApiEndpointsEnum, PaymentMethodEnum } from '../enum';
import { CreatePaymentDto } from '../dto/request/common';
import {
  AttachPurchaserAddressRequestDto,
  CompanyCreditLineRequestDto,
  CompanySearchRequestDto,
  DeactivatePurchaserRequestDto,
  DeletePurchaserRequestDto,
  OnboardPurchaserRequestDto,
  TransactionDataFilterPayloadDto,
  TriggerPurchaserVerificationRequestDto,
  UpdatePurchaserRequestDto,
} from '../dto/request/v1';
import { PaymentMethodMigrationMappingService } from '../../common';
import { ConnectionService } from '../../connection';
import { BusinessModel } from '../../business';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubscriptionService,
  IntegrationModel,
  IntegrationService,
} from '../../integration';
import { BusinessService } from '@pe/business-kit';

@Injectable()
export class ExternalApiExecutor {
  constructor(
    private readonly thirdPartyExternalPaymentCaller: ThirdPartyExternalPaymentCaller,
    private readonly paymentMethodMigrationMappingService: PaymentMethodMigrationMappingService,
    private readonly connectionService: ConnectionService,
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly businessIntegrationService: BusinessIntegrationSubscriptionService,
  ) { }

  public async externalSubmitPayment(
    submitPaymentDto: CreatePaymentDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
    createdApiCall: ApiCallModel,
  ): Promise<ApiCallResultDto> {
    const business: BusinessModel = await this.findBusinessById(businessId);

    return this.thirdPartyExternalPaymentCaller.doSubmitPayment(
      submitPaymentDto,
      headersHolder,
      business,
      createdApiCall,
    );
  }

  public async externalRiskSessionId(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentMethod?: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.riskSession);
    const connection: ConnectionModel = paymentMethod
      ? await this.findConnectionByBusinessIdAndPaymentMethod(businessId, paymentMethod, true)
      : await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.getRiskSessionId(headersHolder, connection);
  }

  public async externalPaymentPreInitialization(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentMethod: PaymentMethodEnum,
    preInitRequest: any,
  ): Promise<any> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.paymentPreInitialize);
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return;
    }

    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethod(businessId, paymentMethod, true);

    return this.thirdPartyExternalPaymentCaller.paymentPreInitialization(preInitRequest, headersHolder, connection);
  }

  public async externalFinanceExpressSubmit(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentMethod: PaymentMethodEnum,
    submitRequest: any,
  ): Promise<any> {
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethod(businessId, paymentMethod, true);

    return this.thirdPartyExternalPaymentCaller.doFinanceExpressPayment(submitRequest, headersHolder, connection);
  }

  public async externalTerms(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentMethod: string,
    connection?: ConnectionModel,
  ): Promise<any> {
    if (!connection) {
      connection =
        await this.findConnectionByBusinessIdAndPaymentMethod(businessId, paymentMethod, true);
    } else {
      connection = await this.mapMigrationConnection(connection);
    }

    return this.thirdPartyExternalPaymentCaller.getExternalTerms(headersHolder, connection);
  }

  public async externalRates(
    headersHolder: HeadersHolderDto,
    connection: ConnectionModel,
    queryDto: any,
  ): Promise<ApiCallResultDto> {
    connection = await this.mapMigrationConnection(connection);

    return this.thirdPartyExternalPaymentCaller.getRates(headersHolder, connection, queryDto);
  }

  public async externalCompanySearch(
    companySearchRequestDto: CompanySearchRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.companySearch);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.searchCompany(
      companySearchRequestDto,
      headersHolder,
      connection,
    );
  }

  public async externalTransactionDataByPayment(
    payment: PaymentModel,
  ): Promise<ApiCallResultDto> {
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethod(payment.business_uuid, payment.payment_type);

    const data: any = { paymentId: payment.original_id };

    return this.thirdPartyExternalPaymentCaller.transactionDataByPaymentId(
      data,
      connection,
    );
  }

  public async externalTransactionDataByBusinessId(
    businessId: string,
    paymentMethod: string,
    dto: TransactionDataFilterPayloadDto,
  ): Promise<ApiCallResultDto> {
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethod(businessId, paymentMethod);

    dto.businessId = businessId;
    dto.paymentMethod = paymentMethod;

    return this.thirdPartyExternalPaymentCaller.transactionDataByBusinessId(
      dto,
      connection,
    );
  }

  public async externalGetCompanyCreditLine(
    companyCreditLineRequestDto: CompanyCreditLineRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.companyCreditLine);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.getCompanyCreditLine(
      companyCreditLineRequestDto,
      headersHolder,
      connection,
    );
  }

  public async externalOnboardPurchaser(
    dto: OnboardPurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.onboardPurchaser);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.onboardPurchaser(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalUpdatePurchaser(
    dto: UpdatePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.updatePurchaser);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.updatePurchaser(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalDeletePurchaser(
    dto: DeletePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.deletePurchaser);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.deletePurchaser(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalDeactivatePurchaser(
    dto: DeactivatePurchaserRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.deactivatePurchaser);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.deactivatePurchaser(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalAttachPurchaserAddress(
    dto: AttachPurchaserAddressRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.attachPurchaserAddress);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.attachPurchaserAddress(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalTriggerPurchaserVerification(
    dto: TriggerPurchaserVerificationRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
  ): Promise<ApiCallResultDto> {
    const allowedPaymentMethods: PaymentMethodEnum[] =
      AllowedApiEndpointsPaymentMethods.get(ExternalApiEndpointsEnum.triggerPurchaserVerification);
    const connection: ConnectionModel =
      await this.findConnectionByBusinessIdAndPaymentMethodsList(businessId, allowedPaymentMethods, true);

    return this.thirdPartyExternalPaymentCaller.triggerPurchaserVerification(
      dto,
      headersHolder,
      connection,
    );
  }

  public async externalAction(
    payment: PaymentModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<PaymentActionDto> {
    return this.thirdPartyExternalPaymentCaller.executeAction(payment, actionWrapper);
  }

  public async getTransactionHistory(
    headersHolder: HeadersHolderDto,
    payment: PaymentModel,
    action: string,
    limit: number,
  ): Promise<TransactionHistoryDto[]> {
    return this.thirdPartyExternalPaymentCaller.getTransactionHistory(
      headersHolder,
      payment,
      action,
      limit,
    );
  }

  public async getRecentTransactionHistoryEntries(
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentId: string,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {
    return this.thirdPartyExternalPaymentCaller.getRecentTransactionHistoryEntries(
      headersHolder,
      businessId,
      paymentId,
      queryDto,
    );
  }

  public async getRecentTransactionHistory(
    headersHolder: HeadersHolderDto,
    businessId: string,
    action: string,
    queryDto: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryDto[]> {
    return this.thirdPartyExternalPaymentCaller.getRecentTransactionHistory(
      headersHolder,
      businessId,
      action,
      queryDto,
    );
  }

  private async findBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    if (!business) {
      throw new NotFoundException(`Business "${businessId}" not found`);
    }

    await business.populate('businessDetail').execPopulate();

    return business;
  }

  private async findConnectionByBusinessIdAndPaymentMethod(
    businessId: string,
    paymentMethod: string,
    doMapMigration: boolean = false,
  ): Promise<ConnectionModel> {
    const business: BusinessModel = await this.findBusinessById(businessId);

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(paymentMethod);

    if (!integration) {
      throw new NotFoundException(`Payment method "${paymentMethod}" not found`);
    }

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integration);

    if (!connections || !Array.isArray(connections) || !connections.length) {
      throw new NotFoundException(`Connection not found for payment method "${paymentMethod}"`);
    }

    let connection: ConnectionModel = connections.shift();

    if (doMapMigration) {
      connection = await this.mapMigrationConnection(connection);
    }

    return connection;
  }

  private async findConnectionByBusinessIdAndPaymentMethodsList(
    businessId: string,
    paymentMethods: string[],
    doMapMigration: boolean = false,
  ): Promise<ConnectionModel> {
    const business: BusinessModel = await this.findBusinessById(businessId);

    const integrations: IntegrationModel[] =
      await this.integrationService.findManyByNames(paymentMethods);

    if (!integrations || !integrations.length) {
      throw new NotFoundException(`Integrations not found`);
    }

    const businessSubscriptions: BusinessIntegrationSubModel[] =
      await this.businessIntegrationService.findByBusiness(business);
    const enabledBusinessIntegrationNames: string[] = businessSubscriptions
      .map((subscription: BusinessIntegrationSubModel) => subscription.integration.name);

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegrationsList(
        business,
        integrations.filter((target: IntegrationModel) => enabledBusinessIntegrationNames.includes(target.name)),
      );

    if (!connections || !Array.isArray(connections) || !connections.length) {
      throw new NotFoundException(`Connections not found for payment methods "${paymentMethods.join(', ')}"`);
    }

    let connection: ConnectionModel = connections.shift();

    if (doMapMigration) {
      connection = await this.mapMigrationConnection(connection);
    }

    return connection;
  }

  private async mapMigrationConnection(connection: ConnectionModel): Promise<ConnectionModel> {
    if (!connection) {
      return;
    }

    let mappedConnection: ConnectionModel;

    await connection.populate('integration').execPopulate();

    const enabledMapping: PaymentMethodMigrationMappingModel =
      await this.paymentMethodMigrationMappingService.findEnabledPaymentMethodMapping(
        connection.integration.name,
        connection.businessId,
      );

    if (enabledMapping && connection.mappedReference) {
      mappedConnection = await this.connectionService.findById(connection.mappedReference);
      if (!mappedConnection) {
        throw new NotFoundException('Mapped reference connection not found');
      }
    }

    return mappedConnection || connection;
  }
}
