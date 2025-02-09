import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { ChannelSetModel } from '../../channel-set';
import { CheckoutModel } from '../../checkout/models';
import { ApiCallSchemaName } from '../../mongoose-schema';
import { FlowRequestDto } from '../../flow/dto';
import { ApiCallModel, PaymentMethodMigrationMappingModel } from '../models';
import { ApiCallInterface } from '../interfaces';
import { ApiCallEventEnum, SalutationEnum } from '../enum';
import { SalutationTransformer } from '../transformers';
import { ConnectionModel } from '../../connection/models';
import { ConnectionService } from '../../connection/services';
import { PaymentMethodMigrationMappingService } from './payment-method-migration-mapping.service';
import { ChannelSetRetriever } from './channel-set.retriever';
import { DEFAULT_CHECKOUT_LANGUAGE } from '../constants';
import { CheckoutLanguageInterface } from '../../checkout/interfaces';
import { CreatePaymentDto } from '../../legacy-api/dto/request/common';
import { environment } from '../../environments';

@Injectable()
export class ApiCallService {
  constructor(
    @InjectModel(ApiCallSchemaName) private readonly apiCallModel: Model<ApiCallModel>,
    private readonly businessService: BusinessService,
    private readonly channelSetRetriever: ChannelSetRetriever,
    private readonly connectionService: ConnectionService,
    private readonly paymentMethodMigrationMappingService: PaymentMethodMigrationMappingService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async findApiCallById(id: string): Promise<ApiCallModel> {
    return this.apiCallModel.findById(id);
  }

  public async markTwoFactorTriggered(apiCall: ApiCallModel): Promise<ApiCallModel> {
    return this.apiCallModel.findOneAndUpdate(
      {
        _id: apiCall.id,
      },
      {
        $set: { two_factor_triggered: true },
      },
    );
  }

  public async createApiCallFromCommonCreatePaymentRequestDto(
    businessId: string,
    paymentDto: CreatePaymentDto,
  ): Promise<ApiCallModel> {
    const apiCall: ApiCallInterface = {
      ...paymentDto,
      businessId,
    } as ApiCallInterface;

    await this.applyPaymentMethodMigrationMapping(apiCall);

    apiCall.channel_source = apiCall.channel_source || apiCall.plugin_version;

    apiCall.salutation =
      SalutationTransformer.mapLegacyApiSalutationToPayeverEnum(paymentDto.salutation) as SalutationEnum;

    if (typeof paymentDto.cart === 'string') {
      apiCall.cart = JSON.parse(paymentDto.cart);
    }

    if (typeof paymentDto.extra === 'string') {
      apiCall.extra = JSON.parse(paymentDto.extra);
    }

    if (typeof paymentDto.shipping_address === 'string') {
      apiCall.shipping_address = JSON.parse(paymentDto.shipping_address);
    }

    if (apiCall.shipping_address?.salutation) {
      apiCall.shipping_address.salutation = SalutationTransformer.mapLegacyApiSalutationToPayeverEnum(
        apiCall.shipping_address.salutation,
      ) as SalutationEnum;
    }

    if (!paymentDto.locale) {
      apiCall.locale = await this.guessLocale(apiCall);
    }

    return this.createApiCall(apiCall);
  }

  public async updateApiCallWithExecutionTime(apiCall: ApiCallModel, executionTime: string): Promise<ApiCallModel> {
    apiCall.execution_time = executionTime;
    await this.apiCallModel.updateOne(
      {
        _id: apiCall.id,
      },
      {
        $set: { execution_time: executionTime },
      },
    );

    await this.eventDispatcher.dispatch(ApiCallEventEnum.apiCallUpdated, apiCall);

    return apiCall;
  }

  public async createApiCallFromFlowRequestDto(
    flowRequestDto: FlowRequestDto,
    channelSet: ChannelSetModel,
  ): Promise<ApiCallModel> {
    await channelSet.populate('checkout').execPopulate();

    const channel: string = channelSet.type;
    const checkout: CheckoutModel = channelSet.checkout;

    if (!checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;

    const apiCall: ApiCallInterface = {
      amount: flowRequestDto.amount,
      businessId: business.id,
      channel,
      channel_set_id: channelSet.id,
      currency: business.currency,
      down_payment: flowRequestDto.downPayment,
      order_id: flowRequestDto.reference,

      allow_cart_step: !flowRequestDto.cart || !flowRequestDto.cart.length,
      use_inventory: !flowRequestDto.cart || !flowRequestDto.cart.length,

      cancel_url: flowRequestDto.cancelUrl || checkout.settings?.callbacks?.cancelUrl,
      customer_redirect_url: flowRequestDto.customerRedirectUrl || checkout.settings?.callbacks?.customerRedirectUrl,
      failure_url: flowRequestDto.failureUrl || checkout.settings?.callbacks?.failureUrl,
      notice_url: flowRequestDto.noticeUrl || checkout.settings?.callbacks?.noticeUrl,
      pending_url: flowRequestDto.pendingUrl || checkout.settings?.callbacks?.pendingUrl,
      success_url: flowRequestDto.successUrl || checkout.settings?.callbacks?.successUrl,
    };

    return this.createApiCall(apiCall);
  }

  public async applyPaymentFlowId(apiCall: ApiCallModel, flowId: string): Promise<void> {
    await this.apiCallModel.updateOne(
      { _id: apiCall.id },
      { flowId: flowId },
    );
  }

  public async guessLocale(
    apiCall: ApiCallInterface,
  ): Promise<string> {
    if (apiCall.locale) {
      const isLanguageSupported: boolean = environment.supportedLanguages.some(
        (lang: string) => lang.toLowerCase() === apiCall.locale.toLowerCase());

      if (!isLanguageSupported) {
        return DEFAULT_CHECKOUT_LANGUAGE;
      }

      return apiCall.locale;
    }

    const business: BusinessModel = await this.businessService.findOneById(apiCall.businessId) as BusinessModel;
    const channelSet: ChannelSetModel = await this.channelSetRetriever.getChannelSetFromApiCall(apiCall, business);
    await channelSet?.populate('checkout')?.execPopulate();
    const checkout: CheckoutModel = channelSet?.checkout;

    if (!checkout) {
      return DEFAULT_CHECKOUT_LANGUAGE;
    }

    const checkoutLocales: CheckoutLanguageInterface[] =
      checkout.settings.languages.sort(
        (langA: CheckoutLanguageInterface, langB: CheckoutLanguageInterface) => {
          return langA.isDefault ? -1 : langB.isDefault ? 1 : 0;
        },
      ).filter((lang: CheckoutLanguageInterface) => lang.active);

    if (checkoutLocales.length) {
      return checkoutLocales.shift().code;
    }

    return DEFAULT_CHECKOUT_LANGUAGE;
  }

  public async updateApiCallWithCallbackUrls(
    apiCall: ApiCallModel,
    channelSet: ChannelSetModel,
  ): Promise<ApiCallModel> {
    await channelSet.populate('checkout').execPopulate();

    const checkout: CheckoutModel = channelSet.checkout;

    if (!checkout) {
      return apiCall;
    }
    apiCall.cancel_url = apiCall.cancel_url ? apiCall.cancel_url : checkout.settings?.callbacks?.cancelUrl;
    apiCall.success_url = apiCall.success_url ?  apiCall.success_url : checkout.settings?.callbacks?.successUrl;
    apiCall.pending_url = apiCall.pending_url ?  apiCall.pending_url : checkout.settings?.callbacks?.pendingUrl;
    apiCall.notice_url = apiCall.notice_url ?  apiCall.notice_url : checkout.settings?.callbacks?.noticeUrl;
    apiCall.failure_url = apiCall.failure_url ?  apiCall.failure_url : checkout.settings?.callbacks?.failureUrl;
    apiCall.customer_redirect_url =
      apiCall.customer_redirect_url ? apiCall.customer_redirect_url : checkout.settings?.callbacks?.customerRedirectUrl;

    return this.apiCallModel.findOneAndUpdate(
      {
        _id: apiCall._id,
      },
      {
        $set: apiCall,
      },
      {
        new: true,
      }
    );

  }

  private async createApiCall(apiCall: ApiCallInterface): Promise<ApiCallModel> {
    const extraData: any = apiCall.extra;
    const createdModel: ApiCallModel = await this.apiCallModel.create(apiCall as ApiCallModel);

    await this.eventDispatcher.dispatch(ApiCallEventEnum.apiCallCreated, createdModel);
    createdModel.extra = extraData;

    return createdModel;
  }

  private async applyPaymentMethodMigrationMapping(apiCall: ApiCallInterface): Promise<void> {
    if (!apiCall.payment_method) {
      return;
    }

    const enabledMapping: PaymentMethodMigrationMappingModel =
      await this.paymentMethodMigrationMappingService.findEnabledPaymentMethodMapping(
        apiCall.payment_method,
        apiCall.businessId,
      );

    if (!enabledMapping) {
      return;
    }

    apiCall.original_mapped_payment_method = apiCall.payment_method;
    apiCall.payment_method = enabledMapping.paymentMethodTo;

    if (apiCall.variant_id) {
      const connection: ConnectionModel = await this.connectionService.findById(apiCall.variant_id);
      if (connection && connection.mappedReference) {
        apiCall.original_mapped_variant_id = apiCall.variant_id;
        apiCall.variant_id = connection.mappedReference;
      }
    }
  }
}
