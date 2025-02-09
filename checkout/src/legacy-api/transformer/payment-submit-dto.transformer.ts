/* eslint-disable @typescript-eslint/tslint/config */
import { BusinessModel } from '../../business/models';
import { ChannelSetModel } from '../../channel-set/models';
import { ThirdPartyPaymentItemSubmitInterface, ThirdPartyPaymentSubmitInterface } from '../interfaces';
import { ApiCallToFlowDtoTransformer } from '../../flow/transformers';
import { ApiCallModel } from '../../common/models';
import { SalutationTransformer } from '../../common/transformers';
import { ApiCallCartItemInterface } from '../../common/interfaces';
import * as _ from 'lodash';
import { CreatePaymentDto } from '../dto/request/common';
import { DIRECT_SUBMIT_FLOW_ID } from '../../common';

export class PaymentSubmitDtoTransformer {
  public static submitDtoToTPPMDto(
    submitDto: CreatePaymentDto,
    apiCall?: ApiCallModel,
    business?: BusinessModel,
    channelSet?: ChannelSetModel,
  ): ThirdPartyPaymentSubmitInterface {
    if (!submitDto.fee) {
      submitDto.fee = 0;
    }

    const paymentData: any = submitDto.payment_data || { };
    if (apiCall.birthdate) {
      paymentData.birthDate = apiCall.birthdate;
      submitDto.payment_data = paymentData;
    }

    const tppmSubmit: ThirdPartyPaymentSubmitInterface = {
      payment: {
        amount: Math.round((submitDto.amount - submitDto.fee + Number.EPSILON) * 100) / 100,
        address: {
          addressLine2: submitDto.address_line_2,
          city: submitDto.city,
          country: submitDto.country,
          firstName: submitDto.first_name,
          lastName: submitDto.last_name,
          region: submitDto.region,
          street: ApiCallToFlowDtoTransformer.prepareStreetFromApiCallAddress(submitDto),
          streetName: submitDto.street,
          streetNumber: submitDto.street_number,
          salutation: SalutationTransformer.mapLegacyApiSalutationToPayeverEnum(submitDto.salutation),
          zipCode: submitDto.zip,
          email: submitDto.email,
          phone: submitDto.phone,
        },
        apiCallId: apiCall?.id,
        businessName: business?.name,
        businessId: business?.id,
        channel: channelSet?.type,
        channelType: channelSet?.subType,
        channelSource: apiCall?.channel_source || apiCall?.plugin_version,
        pluginVersion: apiCall?.plugin_version,
        channelSetId: channelSet?.id,
        currency: submitDto.currency,
        customerEmail: submitDto.email,
        customerName: `${submitDto.first_name} ${submitDto.last_name}`,
        customerType: submitDto.customer_type,
        reference: submitDto.order_id,
        deliveryFee: submitDto.fee,
        orderId: submitDto.order_ref,
        total: submitDto.amount,
        flowId: DIRECT_SUBMIT_FLOW_ID,
        locale: apiCall.locale,
      },
      paymentDetails: this.preparePaymentData(submitDto.payment_data),
      paymentItems: PaymentSubmitDtoTransformer.apiCallToTPPMCart(apiCall),
      clientIp: submitDto.client_ip,
      userAgent: submitDto.user_agent,
      forceRedirect: submitDto.payment_data?.force_redirect || false,
      skipHandlePaymentFee: submitDto.skip_handle_payment_fee || false,
      redirectUrlExpiresAt: submitDto.expires_at,
      autoCaptureEnabled: submitDto.auto_capture_enabled,
      autoCaptureDate: submitDto.auto_capture_date,
    };

    if (submitDto.shipping_address) {
      tppmSubmit.payment.shippingAddress = {
        addressLine2: submitDto.shipping_address.address_line_2,
        city: submitDto.shipping_address.city,
        country: submitDto.shipping_address.country,
        firstName: submitDto.shipping_address.first_name,
        lastName: submitDto.shipping_address.last_name,
        region: submitDto.shipping_address.region,
        street: ApiCallToFlowDtoTransformer.prepareStreetFromApiCallAddress(submitDto.shipping_address),
        streetName: submitDto.shipping_address.street,
        streetNumber: submitDto.shipping_address.street_number,
        salutation: SalutationTransformer.mapLegacyApiSalutationToPayeverEnum(submitDto.shipping_address.salutation),
        zipCode: submitDto.shipping_address.zip,
      };
    }

    if (submitDto.company) {
      tppmSubmit.payment.company = {
        externalId: submitDto.company.external_id,
        homepage: submitDto.company.homepage,
        name: submitDto.company.name,
        registrationLocation: submitDto.company.registration_location,
        registrationNumber: submitDto.company.registration_number,
        taxId: submitDto.company.tax_id,
        type: submitDto.company.type,
      };
    }

    if (submitDto.shipping_option) {
      tppmSubmit.payment.shippingOption = {
        name: submitDto.shipping_option.name,
        carrier: submitDto.shipping_option.carrier,
        category: submitDto.shipping_option.category,
        price: submitDto.shipping_option.price,
        taxRate: submitDto.shipping_option.tax_rate,
        taxAmount: submitDto.shipping_option.tax_amount,
        details: {
          timeslot: submitDto.shipping_option.details?.timeslot,
          pickupLocation: {
            address: submitDto.shipping_option.details?.pickup_location?.address ? {
              addressLine2: submitDto.shipping_option.details?.pickup_location?.address?.address_line_2,
              city: submitDto.shipping_option.details?.pickup_location?.address?.city,
              country: submitDto.shipping_option.details?.pickup_location?.address?.country,
              firstName: submitDto.shipping_option.details?.pickup_location?.address?.first_name,
              lastName: submitDto.shipping_option.details?.pickup_location?.address?.last_name,
              region: submitDto.shipping_option.details?.pickup_location?.address?.region,
              street: ApiCallToFlowDtoTransformer.prepareStreetFromApiCallAddress(
                submitDto.shipping_option.details?.pickup_location?.address,
              ),
              streetName: submitDto.shipping_option.details?.pickup_location?.address?.street,
              streetNumber: submitDto.shipping_option.details?.pickup_location?.address?.street_number,
              salutation: SalutationTransformer.mapLegacyApiSalutationToPayeverEnum(
                submitDto.shipping_option.details?.pickup_location?.address?.salutation,
              ) || undefined,
              zipCode: submitDto.shipping_option.details?.pickup_location?.address?.zip,
            } : undefined,
            id: submitDto.shipping_option.details?.pickup_location?.id,
            name: submitDto.shipping_option.details?.pickup_location?.name,
          },
        },
      };
    }

    return tppmSubmit;
  }

  public static apiCallToTPPMCart(apiCall: ApiCallModel): ThirdPartyPaymentItemSubmitInterface[] {
    if (!apiCall?.cart || !Array.isArray(apiCall.cart) || !apiCall.cart.length) {
      return [];
    }

    return apiCall.cart.map((cartItem: ApiCallCartItemInterface) => {
      return {
        description: cartItem.description,
        extraData: cartItem.extra_data,
        identifier: cartItem.identifier,
        name: cartItem.name,
        price: cartItem.price,
        priceNet: cartItem.price_netto,
        quantity: cartItem.quantity,
        sku: cartItem.sku,
        thumbnail: cartItem.thumbnail,
        url: cartItem.url,
        vatRate: cartItem.vat_rate,

        brand: cartItem.brand,
        totalAmount: cartItem.total_amount,
        totalTaxAmount: cartItem.total_tax_amount,
        totalDiscountAmount: cartItem.total_discount_amount,
        imageUrl: cartItem.image_url,
        productUrl: cartItem.product_url,
        type: cartItem.type,
      };
    });
  }

  private static preparePaymentData(paymentData: object): object {
    if (!paymentData || !Object.keys(paymentData).length) {
      return paymentData;
    }

    return _.transform(paymentData, (r: object, v: any, k: string) => {
      r[_.camelCase(k)] = (typeof v === 'object') ? this.preparePaymentData(v) : v;
    });
  }
}
