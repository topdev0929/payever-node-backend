import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccessTokenPayload, EventDispatcher } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../checkout';
import { ConnectionModel } from '../../connection/models';
import { CheckoutConnectionService, ConnectionService } from '../../connection/services';
import { IntegrationCategory, IntegrationService, IntegrationModel } from '../../integration';
import {
  FlowAuthorizationRequestDto,
  FlowCallbackListResponseDto,
  FlowPatchRequestDto,
  FlowRequestDto,
  FlowResponseDto,
  PaymentFlowDto,
} from '../dto';
import { FlowModel } from '../models';
import { FlowEventsEnum, FlowStatesEnum } from '../enum';
import { PaymentMethodsConfigs } from '../../common/config';
import {
  ApiCallToFlowDtoTransformer,
  FlowToResponseTransformer,
  MigrateEventToFlowDtoTransformer,
} from '../transformers';
import { FlowPaymentMethodsFiltersCollector } from '../filters';
import { FlowAccessChecker } from '../security';
import {
  ApiCallService,
  ChannelSetRetriever,
  CheckoutDbService,
  CheckoutIntegrationSubscriptionService,
} from '../../common/services';
import { PaymentMethodInterface } from '../../common/interfaces';
import { FlowSchemaName } from '../../mongoose-schema/schemas/flow';
import { ApiCallModel } from '../../common/models';
import { v4 as uuid } from 'uuid';
import { FlowInterface } from '../interfaces';
import { CheckoutBusinessService } from '../../business/services/checkout-business.service';
import { API_CALL_ID_PATTERN, PAYMENT_ID_PATTERN } from '../constants';
import { CallbackTypeEnum, CheckoutBusinessTypeEnum } from '../../common/enum';
import { environment } from '../../environments';
import { DIRECT_SUBMIT_FLOW_ID } from '../../common';

@Injectable()
export class FlowService {
  constructor(
    @InjectModel(FlowSchemaName) private readonly flowModel: Model<FlowModel>,
    private readonly apiCallService: ApiCallService,
    @Inject(forwardRef(() => ChannelSetService))
    private readonly channelSetService: ChannelSetService,
    private readonly channelSetRetriever: ChannelSetRetriever,
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly checkoutDbService: CheckoutDbService,
    private readonly connectionService: ConnectionService,
    private readonly checkoutConnectionService: CheckoutConnectionService,
    private readonly flowTransformer: FlowToResponseTransformer,
    private readonly flowPaymentMethodsFiltersCollector: FlowPaymentMethodsFiltersCollector,
    private readonly flowAccessChecker: FlowAccessChecker,
    private readonly eventDispatcher: EventDispatcher,
    private readonly checkoutBusinessService: CheckoutBusinessService,
    private readonly integrationService: IntegrationService,
  ) { }

  public async initFlow(
    flowRequestDto: FlowRequestDto,
    user: AccessTokenPayload,
    request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    const flow: FlowModel = await this.createFlowFromRequestDto(flowRequestDto);
    await this.flowAccessChecker.assignFlowVisibility(flow, user, request);

    return this.prepareFlowResponse(flow);
  }

  public async initFlowFromApiCall(
    apiCall: ApiCallModel,
    request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    this.checkApiCallExpired(apiCall);

    const flowRequestDto: FlowRequestDto = await this.prepareFlowRequestDtoFromApiCall(apiCall);
    const flow: FlowModel = await this.createFlowFromRequestDto(flowRequestDto);
    await this.flowAccessChecker.assignFlowVisibility(flow, null, request);

    if (!apiCall.reusable) {
      await this.apiCallService.applyPaymentFlowId(apiCall, flow.id);
    }

    return this.prepareFlowResponse(flow);
  }

  public async updateFlow(
    flow: FlowModel,
    flowRequestDto: FlowPatchRequestDto,
  ): Promise<FlowResponseDto> {
    flow = await this.updateFlowFromRequestDto(flow, flowRequestDto);

    return this.prepareFlowResponse(flow);
  }

  public async finalizeFlow(
    flow: FlowModel,
  ): Promise<FlowResponseDto> {
    flow = await this.flowModel.findOneAndUpdate(
      { _id: flow.id },
      { $set: { state: FlowStatesEnum.finished } },
      { new: true },
    );

    return this.prepareFlowResponse(flow);
  }

  public async cloneFlowById(
    flowId: string,
    user: AccessTokenPayload,
    request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    const flow: FlowModel = await this.flowModel.findOne({
      $or: [
        { _id: flowId },
        { flowId },
      ],
    });

    if (!flow) {
      throw new NotFoundException(`Flow not found by id ${flowId}`);
    }

    return this.cloneFlow(flow, user, request);
  }

  public async findById(id: string): Promise<FlowModel> {
    return this.flowModel.findOne({ _id: id });
  }

  public async cloneFlow(
    flow: FlowModel,
    user: AccessTokenPayload,
    request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    await this.flowAccessChecker.checkFlowAccess(flow, user);

    const plainFlow: any = Object.assign({ }, { ...flow as any}._doc);
    plainFlow.state = FlowStatesEnum.inProgress;
    delete plainFlow._id;
    delete plainFlow.__v;
    delete plainFlow.paymentId;

    const clonedFlow: FlowModel = await this.flowModel.create(plainFlow);
    await this.flowAccessChecker.assignFlowVisibility(clonedFlow, user, request);

    await this.eventDispatcher.dispatch(FlowEventsEnum.flowCreated, clonedFlow);

    return this.prepareFlowResponse(clonedFlow);
  }

  public async authorizeFlow(
    flow: FlowModel,
    flowAuthorizationRequestDto: FlowAuthorizationRequestDto,
  ): Promise<void> {
    await this.flowAccessChecker.authorizeFlowForToken(flow, flowAuthorizationRequestDto);
  }

  public async prepareFlowResponse(
    flow: FlowModel,
  ): Promise<FlowResponseDto> {
    let checkout: CheckoutModel;
    if (!flow.checkoutId) {
      const channelSet: ChannelSetModel = await this.channelSetService.findOneById(flow.channelSetId);
      await channelSet.populate('checkout').execPopulate();
      checkout = channelSet.checkout;
    } else {
      checkout = await this.checkoutDbService.findOneById(flow.checkoutId);
    }

    const business: BusinessModel = await this.checkoutBusinessService.findOneById(flow.businessId);
    const apiCall: ApiCallModel = flow.apiCallId ? await this.apiCallService.findApiCallById(flow.apiCallId) : null;

    const checkoutIntegrationSubs: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);
    const businessConnections: ConnectionModel[] =
      await this.checkoutConnectionService.getInstalledConnections(checkout, business);
    let enabledPaymentMethods: PaymentMethodInterface[] = checkoutIntegrationSubs
      .filter(
        (subscription: CheckoutIntegrationSubModel) =>
          subscription.integration.category === IntegrationCategory.Payments,
      ).map((subscription: CheckoutIntegrationSubModel) => {
        return PaymentMethodsConfigs.find((paymentMethod: PaymentMethodInterface) => {
          return paymentMethod.payment_method === subscription.integration.name &&
            paymentMethod.payment_issuer === subscription.integration.issuer;
        });
      });
    let enabledConnections: ConnectionModel[] = businessConnections.filter((connection: ConnectionModel) => {
      return enabledPaymentMethods.some(
        (paymentMethod: PaymentMethodInterface) =>
          paymentMethod.payment_method === connection.integration.name &&
          paymentMethod.payment_issuer === connection.integration.issuer,
      );
    });

    [enabledPaymentMethods, enabledConnections] = await this.flowPaymentMethodsFiltersCollector.filterAll(
      flow,
      enabledPaymentMethods,
      enabledConnections,
    );

    return this.flowTransformer.flowModelToResponse(
      flow,
      business,
      apiCall,
      enabledPaymentMethods,
      enabledConnections,
    );
  }

  public async createFlowFromMigrateEvent(flowEventDto: PaymentFlowDto): Promise<FlowModel> {
    const flowRequestDto: FlowInterface = MigrateEventToFlowDtoTransformer.migrateEventToFlowDto(flowEventDto);
    this.prepareSpecificFlowFields(flowRequestDto);

    return this.flowModel.findOneAndUpdate(
      { flowId: flowEventDto.id },
      {
        $set: {
          ...flowRequestDto,
          flowId: flowEventDto.id,
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      { new: true, upsert: true },
    );
  }

  public async prepareCallbacksResponse(flow: FlowModel): Promise<FlowCallbackListResponseDto> {
    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(flow.apiCallId);
    if (!apiCall) {
      throw new NotFoundException(`Api call not found by id ${flow.apiCallId}`);
    }

    return this.prepareCallbackUrls(flow._id, apiCall);
  }

  public async applyPaymentId(flowId?: string, paymentId?: string): Promise<void> {
    if (!flowId || !paymentId || flowId === DIRECT_SUBMIT_FLOW_ID) {
      return;
    }

    await this.flowModel.updateOne(
      { _id: flowId },
      { paymentId: paymentId },
    );
  }

  public async getCallbackUrl(flow: FlowModel, callbackType: CallbackTypeEnum): Promise<string> {
    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(flow.apiCallId);

    if (!apiCall) {
      throw new NotFoundException(`Api call not found by id ${flow.apiCallId}`);
    }

    let redirectUrl: string = '';

    switch (callbackType) {
      case CallbackTypeEnum.success:
        redirectUrl = apiCall.success_url;
        break;
      case CallbackTypeEnum.cancel:
        redirectUrl = apiCall.cancel_url;
        break;
      case CallbackTypeEnum.failure:
        redirectUrl = apiCall.failure_url;
        break;
      case CallbackTypeEnum.notice:
        redirectUrl = apiCall.notice_url;
        break;
      case CallbackTypeEnum.pending:
        redirectUrl = apiCall.pending_url;
        break;
      case CallbackTypeEnum.customerRedirect:
        redirectUrl = apiCall.customer_redirect_url;
        break;
    }

    redirectUrl = this.modifyCallbackUrl(redirectUrl, flow.apiCallId, flow.paymentId);

    return redirectUrl;
  }

  public async saveTriggeredCallbackUrl(flow: FlowModel, callbackType: CallbackTypeEnum): Promise<void> {
    await this.flowModel.updateOne(
      { _id: flow._id},
      {
        $set: {
          callbackTriggeredAt: new Date(),
          callbackType: callbackType,
        },
      },
    );
  }

  private prepareCallbackUrl(callbackUlr: string, flowId: string, callbackType: CallbackTypeEnum): string {
    return callbackUlr ? `${environment.checkoutMicroUrl}/flow/v1/${flowId}/callback/${callbackType}` : null;
  }

  private modifyCallbackUrl(url?: string, apiCallId?: string, paymentId?: string): string {
    if (!url) {
      return null;
    }

    if (apiCallId) {
      url = url.replace(API_CALL_ID_PATTERN, apiCallId);
    }

    if (paymentId) {
      url = url.replace(PAYMENT_ID_PATTERN, paymentId);
    }

    return url;
  }

  private async createFlowFromRequestDto(
    flowRequestDto: FlowRequestDto,
  ): Promise<FlowModel> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(flowRequestDto.channelSetId);
    if (!channelSet) {
      throw new NotFoundException(`Channel set not found by id ${flowRequestDto.channelSetId}`);
    }
    await channelSet.populate('checkout').execPopulate();
    const checkout: CheckoutModel = channelSet.checkout;
    if (!checkout) {
      throw new NotFoundException(`Checkout is missing for channel set ${flowRequestDto.channelSetId}`);
    }

    if (flowRequestDto.connectionId) {
      await this.checkConnectionId(flowRequestDto.connectionId, checkout.businessId);
    }

    if (flowRequestDto.apiCallId) {
      await this.checkApiCallId(flowRequestDto.apiCallId, checkout.businessId);
    } else {
      const apiCall: ApiCallModel =
        await this.apiCallService.createApiCallFromFlowRequestDto(flowRequestDto, channelSet);
      flowRequestDto.apiCallId = apiCall.id;
      flowRequestDto.forceLegacyCartStep = apiCall.allow_cart_step;
      flowRequestDto.forceLegacyUseInventory = apiCall.use_inventory;
    }

    if (!flowRequestDto.currency) {
      const business: BusinessModel = await this.checkoutBusinessService.findOneById(checkout.businessId);
      flowRequestDto.currency = business.currency;
    }

    this.prepareSpecificFlowFields(flowRequestDto);

    const flow: FlowModel = await this.flowModel.create({
      ...flowRequestDto,
      businessId: checkout.businessId,
      businessType: checkout.settings?.businessType || CheckoutBusinessTypeEnum.mixed,
      channel: channelSet.type,
      channelType: channelSet.subType,
      checkoutId: checkout.id,
      disableValidation: flowRequestDto.disableValidation ?? false,
      state: FlowStatesEnum.inProgress,

      footerUrls: {
        disclaimer: flowRequestDto.footerUrls?.disclaimer ?? checkout.settings?.footerUrls?.disclaimer,
        logo: flowRequestDto.footerUrls?.logo ?? checkout.settings?.footerUrls?.logo,
        privacy: flowRequestDto.footerUrls?.privacy ?? checkout.settings?.footerUrls?.privacy,
        support: flowRequestDto.footerUrls?.support ?? checkout.settings?.footerUrls?.support,
      },
      hideImprint: flowRequestDto.hideImprint ?? checkout.settings?.hideImprint ?? false,
      hideLogo: flowRequestDto.hideLogo ?? checkout.settings?.hideLogo ?? false,
    });

    await this.eventDispatcher.dispatch(FlowEventsEnum.flowCreated, flow);

    return flow;
  }

  private async updateFlowFromRequestDto(
    flow: FlowModel,
    flowRequestDto: FlowPatchRequestDto,
  ): Promise<FlowModel> {
    if (flowRequestDto.connectionId) {
      await this.checkConnectionId(flowRequestDto.connectionId, flow.businessId);
    }

    this.prepareSpecificFlowFields(flowRequestDto, flow);

    flow = await this.flowModel.findOneAndUpdate(
      { _id: flow.id },
      { $set: flowRequestDto },
      { new: true },
    );

    await this.eventDispatcher.dispatch(FlowEventsEnum.flowUpdated, flow);

    return flow;
  }

  private async prepareFlowRequestDtoFromApiCall(
    apiCall: ApiCallModel,
    extraRawFlowData?: any,
  ): Promise<FlowRequestDto> {
    const business: BusinessModel = await this.checkoutBusinessService.findOneById(apiCall.businessId);
    const channelSet: ChannelSetModel = await this.channelSetRetriever.getChannelSetFromApiCall(apiCall, business);
    if (!channelSet) {
      const channelTypeString: string =
        apiCall.channel_type ? `${apiCall.channel}/${apiCall.channel_type}` : apiCall.channel;
      throw new NotFoundException(
        `Channel set of type "${channelTypeString}" not found for business "${business.id}"`,
      );
    }

    const flowRequest: FlowRequestDto =
      ApiCallToFlowDtoTransformer.apiCallToPaymentFlowDto(apiCall, business, channelSet, extraRawFlowData);

    if (!flowRequest.connectionId && apiCall.payment_method) {
      flowRequest.connectionId = await this.getDefaultConnectionId(apiCall, business);
    }

    return flowRequest;
  }

  private async checkConnectionId(connectionId: string, businessId: string): Promise<void> {
    if (!connectionId || !businessId) {
      return;
    }

    const connection: ConnectionModel = await this.connectionService.findById(connectionId);
    if (!connection) {
      throw new NotFoundException(`Connection not found by id ${connectionId}`);
    }

    if (connection.businessId !== businessId) {
      throw new ForbiddenException('Connection is not allowed for given channel set');
    }
  }

  private async checkApiCallId(apiCallId: string, businessId: string): Promise<void> {
    if (!apiCallId || !businessId) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(apiCallId);
    if (!apiCall) {
      throw new NotFoundException(`ApiCall not found by id ${apiCallId}`);
    }

    if (apiCall.businessId !== businessId) {
      throw new ForbiddenException('ApiCall is not allowed for given channel set');
    }
  }

  private checkApiCallExpired(apiCall: ApiCallModel): void {
    if (apiCall.reusable) {
      return;
    }

    if (!apiCall.expires_at && apiCall.flowId) {
      throw new ForbiddenException('Flow already created for api call, please start new checkout');
    }

    if (!apiCall.expires_at) {
      return;
    }

    if (apiCall.expires_at <= new Date()) {
      throw new ForbiddenException('Api call already expired');
    }
  }

  private prepareSpecificFlowFields(flowRequestDto: FlowRequestDto | FlowInterface, flow?: FlowModel): void {
    const amount: number = flowRequestDto.amount || flow?.amount || 0;
    const deliveryFee: number = flowRequestDto.deliveryFee || flow?.deliveryFee || 0;
    const total: number = Math.round((amount + deliveryFee + Number.EPSILON) * 100) / 100;

    flowRequestDto.amount = amount;
    flowRequestDto.deliveryFee = deliveryFee;
    flowRequestDto.total = total;

    if (amount && !flowRequestDto.reference && !flow?.reference) {
      flowRequestDto.reference = this.generateReference();
    }
  }

  private generateReference(prefix: string = ''): string {
    const sec: number = Date.now() * 1000 + Math.random() * 1000;
    const id: string = sec.toString(16).replace(/\./g, '').padEnd(14, '0');

    return `${prefix}${id}${Math.trunc(Math.random() * 100000000)}`;
  }

  private async getDefaultConnectionId(
    apiCall: ApiCallModel,
    business: BusinessModel,
  ): Promise<string> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(apiCall.payment_method);
    if (!integration) {
      return undefined;
    }
    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integration);

    if (connections.length === 1) {
      return connections[0]._id;
    }

    const connection: ConnectionModel = connections.find((item: ConnectionModel) => item.options.default === true);
    if (connection) {
      return connection._id;
    }

    return undefined;
  }

  private prepareCallbackUrls(flowId: string, apiCall: ApiCallModel): FlowCallbackListResponseDto {
    if (!apiCall) {
      return;
    }

    return {
      cancelUrl: this.prepareCallbackUrl(apiCall.success_url, flowId, CallbackTypeEnum.cancel),
      customerRedirectUrl:
        this.prepareCallbackUrl(apiCall.customer_redirect_url, flowId, CallbackTypeEnum.customerRedirect),
      failureUrl: this.prepareCallbackUrl(apiCall.failure_url, flowId, CallbackTypeEnum.failure),
      id: flowId,
      noticeUrl: this.prepareCallbackUrl(apiCall.notice_url, flowId, CallbackTypeEnum.notice),
      pendingUrl: this.prepareCallbackUrl(apiCall.pending_url, flowId, CallbackTypeEnum.pending),
      successUrl: this.prepareCallbackUrl(apiCall.success_url, flowId, CallbackTypeEnum.success),
    };
  }
}
