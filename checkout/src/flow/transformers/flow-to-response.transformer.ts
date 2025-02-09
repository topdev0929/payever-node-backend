/* eslint-disable @typescript-eslint/tslint/config */
import { Injectable } from '@nestjs/common';
import { FlowModel } from '../models';
import {
  FlowAddressResponseDto,
  FlowApiCallResponseDto,
  FlowCartItemResponseDto,
  FlowPaymentOptionResponseDto,
  FlowPaymentOptionVariantResponseDto,
  FlowResponseDto,
} from '../dto';
import { FlowAddressInterface, FlowCartItemInterface } from '../interfaces';
import { ConnectionModel } from '../../connection/models';
import { ConnectionOptionsInterface } from '../../connection/interfaces';
import { BusinessModel } from '../../business/models';
import { PaymentMethodInterface } from '../../common/interfaces';
import { CurrencyExchangeService } from '../../common/services';
import { ApiCallModel } from '../../common/models';
import { CompanyAddressInterface } from '@pe/business-kit/modules';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set/models';
import { CheckoutBusinessTypeEnum } from '../../common/enum';

const API_CALL_ID_PATTERN: string = '--CALL-ID--';

@Injectable()
export class FlowToResponseTransformer {
  constructor(
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  public async flowModelToResponse(
    flow: FlowModel,
    business: BusinessModel,
    apiCall: ApiCallModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<FlowResponseDto> {
    return {
      id: flow.id,

      amount: flow.amount || 0,
      downPayment: flow.downPayment || 0,
      currency: flow.currency || business.currency,
      reference: flow.reference,
      total: (Math.round((flow.amount + flow.deliveryFee + Number.EPSILON) * 100) / 100) || 0,

      cart: this.flowCartToResponseDto(flow.cart),

      billingAddress: this.flowAddressToResponseDto(flow.billingAddress),
      shippingAddress: this.flowAddressToResponseDto(flow.shippingAddress),

      deliveryFee: flow.deliveryFee,
      shippingMethodCode: flow.shippingMethodCode,
      shippingMethodName: flow.shippingMethodName,

      posMerchantMode: flow.posMerchantMode,
      posVerifyType: flow.posVerifyType,

      coupon: flow.coupon,

      forceLegacyCartStep: flow.forceLegacyCartStep,
      forceLegacyUseInventory: flow.forceLegacyUseInventory,

      extra: flow.extra,
      state: flow.state,

      apiCall: this.flowApiCallToResponseDto(apiCall),

      businessId: flow.businessId,
      businessName: business.name,
      businessCountry: business.businessDetail?.companyAddress?.country,
      businessIban: business.businessDetail?.bankAccount?.iban,
      businessAddressLine: FlowToResponseTransformer.businessAddressToLine(business.businessDetail?.companyAddress),
      businessType: flow.businessType || CheckoutBusinessTypeEnum.mixed,

      b2bSearch: FlowToResponseTransformer.isB2bSearchAllowed(enabledPaymentMethods),

      customerType: flow.customerType || apiCall?.customer_type,

      channel: flow.channel || await this.getChannelName(flow),
      channelSetId: flow.channelSetId,
      channelSource: apiCall?.channel_source,
      channelType: flow.channelType,
      checkoutId: flow.checkoutId,
      connectionId: flow.connectionId,
      orderId: flow.orderId,

      company: {
        externalId: flow?.company?.externalId || apiCall?.company?.external_id,
        name: flow?.company?.name || apiCall?.company?.name,
      },

      disableValidation: flow.disableValidation,
      hideImprint: flow.hideImprint,
      hideLogo: flow.hideLogo,
      footerUrls: flow.footerUrls,

      paymentOptions: await this.flowConnectionsToResponseDto(flow, enabledPaymentMethods, enabledConnections),
      pluginVersion: flow.pluginVersion,
      guestToken: flow.guestToken,
    };
  }

  public static isB2bSearchAllowed(
    enabledPaymentMethods: PaymentMethodInterface[],
  ): boolean {
    return enabledPaymentMethods?.some((method: PaymentMethodInterface) => method.is_b2b_method);
  }

  private async flowConnectionsToResponseDto(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    connections: ConnectionModel[],
  ): Promise<FlowPaymentOptionResponseDto[]> {
    const flowPaymentOptionResponseDTOs: FlowPaymentOptionResponseDto[] = [];
    for (const paymentMethod of enabledPaymentMethods) {
      const preparedConnections: FlowPaymentOptionVariantResponseDto[] = [];
      for (const connection of connections) {
        if (connection.integration.name !== paymentMethod.payment_method) {
          continue;
        }

        preparedConnections.push(await this.connectionToVariantResponseDto(paymentMethod, connection, flow.currency));
      }

      if (!preparedConnections.length) {
        continue;
      }

      const paymentOptionResponseDto: FlowPaymentOptionResponseDto = {
        name: paymentMethod.name,
        paymentMethod: paymentMethod.payment_method,
        paymentIssuer: paymentMethod.payment_issuer,
        max: await this.currencyExchangeService.exchangePaymentMethodLimits(
          flow.currency,
          paymentMethod.amount_limits.max,
        ),
        min: await this.currencyExchangeService.exchangePaymentMethodLimits(
          flow.currency,
          paymentMethod.amount_limits.min,
        ),
        fixedFee: paymentMethod.fixed_fee,
        variableFee: paymentMethod.variable_fee,
        shareBagEnabled: paymentMethod.share_bag_enabled,
        connections: preparedConnections,
      };
      flowPaymentOptionResponseDTOs.push(paymentOptionResponseDto);
    }

    const result: FlowPaymentOptionResponseDto[] = [];
    const map: Map<string, boolean> = new Map();
    for (const connection of connections) {
      if (!map.has(connection.integration.name)) {
        map.set(connection.integration.name, true);
        result.push(flowPaymentOptionResponseDTOs.find(
          (responseDto: FlowPaymentOptionResponseDto) => responseDto.paymentMethod === connection.integration.name),
        );
      }
    }

    return result.filter((dto: FlowPaymentOptionResponseDto) => !!dto);
  }

  private async connectionToVariantResponseDto(
    paymentMethod: PaymentMethodInterface,
    connection: ConnectionModel,
    currency: string,
  ): Promise<FlowPaymentOptionVariantResponseDto> {
    const connectionOptions: ConnectionOptionsInterface = connection.options;
    const shippingAddressAllowed: boolean =
      connectionOptions.shippingAddressAllowed !== undefined && connectionOptions.shippingAddressAllowed !== null
        ? connectionOptions.shippingAddressAllowed
        : paymentMethod.shipping_address_allowed;
    const shippingAddressEquality: boolean =
      connectionOptions.shippingAddressEquality !== undefined && connectionOptions.shippingAddressEquality !== null
        ? connectionOptions.shippingAddressEquality
        : paymentMethod.shipping_address_equality;

    const minAmount: { [currency: string]: number } =
      connectionOptions.minAmount ? {[currency]: connectionOptions.minAmount} : paymentMethod.amount_limits.min;
    const maxAmount: { [currency: string]: number } =
      connectionOptions.maxAmount ? {[currency]: connectionOptions.maxAmount} : paymentMethod.amount_limits.max;

    return {
      id: connection.id,
      default: connectionOptions?.default ?? false,
      name: connection.name,
      merchantCoversFee: connectionOptions.acceptFee !== undefined ? connectionOptions.acceptFee : true,
      min: await this.currencyExchangeService.exchangePaymentMethodLimits(currency, minAmount),
      max: await this.currencyExchangeService.exchangePaymentMethodLimits(currency, maxAmount),
      shippingAddressAllowed,
      shippingAddressEquality,
      version: connectionOptions?.version || 'default',
    };
  }

  private flowCartToResponseDto(flowCart: FlowCartItemInterface[]): FlowCartItemResponseDto[] {
    if (!flowCart || !flowCart.length) {
      return [];
    }

    return flowCart.map((item: FlowCartItemInterface) => {
      return {
        extraData: item.extraData,
        identifier: item.identifier,
        image: item.image,
        name: item.name,
        originalPrice: item.originalPrice,
        price: item.price,
        priceNet: item.priceNet,
        productId: item.productId,
        quantity: item.quantity,
        sku: item.sku,
        totalDiscountAmount: item.totalDiscountAmount,
        type: item.type,
        vat: item.vat,
      };
    });
  }

  private flowAddressToResponseDto(flowAddress: FlowAddressInterface): FlowAddressResponseDto {
    if (!flowAddress) {
      return;
    }

    return {
      addressLine2: flowAddress.addressLine2,
      city: flowAddress.city,
      country: flowAddress.country,
      countryName: flowAddress.countryName,
      email: flowAddress.email,
      firstName: flowAddress.firstName,
      lastName: flowAddress.lastName,
      phone: flowAddress.phone,
      region: flowAddress.region,
      salutation: flowAddress.salutation,
      street: flowAddress.street,
      streetName: flowAddress.streetName,
      streetNumber: flowAddress.streetNumber,
      zipCode: flowAddress.zipCode,

      organizationName: flowAddress.organizationName,
      houseExtension: flowAddress.houseExtension,
    };
  }

  private flowApiCallToResponseDto(apiCall: ApiCallModel): FlowApiCallResponseDto {
    if (!apiCall) {
      return;
    }

    return {
      id: apiCall.id,
      birthDate: apiCall.birthdate || null,
      billingAddress: {
        addressLine2: apiCall.address_line_2,
        city: apiCall.city,
        country: apiCall.country,
        email: apiCall.email,
        firstName: apiCall.first_name,
        lastName: apiCall.last_name,
        phone: apiCall.phone,
        region: apiCall.region,
        salutation: apiCall.salutation,
        street: apiCall.street,
        streetNumber: apiCall.street_number,
        zipCode: apiCall.zip,
      },
      cancelUrl: apiCall.cancel_url?.replace(API_CALL_ID_PATTERN, apiCall.id),
      shippingAddress: {
        addressLine2: apiCall.shipping_address?.address_line_2,
        city: apiCall.shipping_address?.city,
        country: apiCall.shipping_address?.country,
        email: null,
        firstName: apiCall.shipping_address?.first_name,
        lastName: apiCall.shipping_address?.last_name,
        phone: null,
        region: apiCall.shipping_address?.region,
        salutation: apiCall.shipping_address?.salutation,
        street: apiCall.shipping_address?.street,
        streetNumber: apiCall.shipping_address?.street_number,
        zipCode: apiCall.shipping_address?.zip,
      },
      skipHandlePaymentFee: apiCall.skip_handle_payment_fee,

      referenceExtra: apiCall.reference_extra,
      purchaseCountry: apiCall.purchase_country,
      customerType: apiCall.customer_type,
      customerGender: apiCall.customer_gender,
      company: {
        type: apiCall.company?.type,
        name: apiCall.company?.name,
        registrationNumber: apiCall.company?.registration_number,
        registrationLocation: apiCall.company?.registration_location,
        taxId: apiCall.company?.tax_id,
        homepage: apiCall.company?.homepage,
        externalId: apiCall.company?.external_id,
      },
      organizationName: apiCall.organization_name,
      houseExtension: apiCall.house_extension,
      shippingOption: {
        name: apiCall.shipping_option?.name,
        carrier: apiCall.shipping_option?.carrier,
        category: apiCall.shipping_option?.category,
        price: apiCall.shipping_option?.price,
        taxRate: apiCall.shipping_option?.tax_rate,
        taxAmount: apiCall.shipping_option?.tax_amount,
        details: {
          timeslot: apiCall.shipping_option?.details?.timeslot,
          pickupLocation: {
            id: apiCall.shipping_option?.details?.pickup_location?.id,
            name: apiCall.shipping_option?.details?.pickup_location?.name,
            address: {
              addressLine2: apiCall.shipping_option?.details?.pickup_location?.address?.address_line_2,
              city: apiCall.shipping_option?.details?.pickup_location?.address?.city,
              country: apiCall.shipping_option?.details?.pickup_location?.address?.country,
              firstName: apiCall.shipping_option?.details?.pickup_location?.address?.first_name,
              lastName: apiCall.shipping_option?.details?.pickup_location?.address?.last_name,
              region: apiCall.shipping_option?.details?.pickup_location?.address?.region,
              salutation: apiCall.shipping_option?.details?.pickup_location?.address?.salutation,
              street: apiCall.shipping_option?.details?.pickup_location?.address?.street,
              streetNumber: apiCall.shipping_option?.details?.pickup_location?.address?.street_number,
              zipCode: apiCall.shipping_option?.details?.pickup_location?.address?.zip,
            },
          },
        },
      },
      splits: apiCall.splits,
      allowSeparateShippingAddress: apiCall.allow_separate_shipping_address,
      allowCustomerTypes: apiCall.allow_customer_types,
      allowBillingStep: apiCall.allow_billing_step,
      allowShippingStep: apiCall.allow_shipping_step,
      useStyles: apiCall.use_styles,
      salutationMandatory: apiCall.salutation_mandatory,
      phoneMandatory: apiCall.phone_mandatory,
      birthdateMandatory: apiCall.birthdate_mandatory,
      autoCaptureEnabled: apiCall.auto_capture_enabled,
      autoCaptureDate: apiCall.auto_capture_date,
      testMode: apiCall.test_mode,
    };
  }

  private async getChannelName(flow: FlowModel): Promise<string> {
    if (flow.channel) {
      return flow.channel;
    }

    if (!flow.channelSetId) {
      return;
    }

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(flow.channelSetId);

    return channelSet?.type;
  }

  private static businessAddressToLine(companyAddress: CompanyAddressInterface): string {
    const addressParts: string[] = [
      companyAddress?.street,
      companyAddress?.zipCode,
      companyAddress?.city,
      companyAddress?.country,
    ];

    return addressParts.filter((part: string) => !!part).join(', ');
  }
}
