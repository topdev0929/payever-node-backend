/* eslint-disable @typescript-eslint/tslint/config */
import { Injectable } from '@nestjs/common';
import { CreatePaymentWrapperDto as V1CreatePaymentWrapperDto } from '../dto/request/v1';
import {
  CreatePaymentWrapperDto as V2CreatePaymentWrapperDto,
  CreatePaymentAddressDto as V2CreatePaymentAddressDto,
} from '../dto/request/v2';
import {
  CreatePaymentItemDto as V3CreatePaymentItemDto,
  CreatePaymentWrapperDto as V3CreatePaymentWrapperDto,
  CreatePaymentAddressDto as V3CreatePaymentAddressDto,
} from '../dto/request/v3';
import {
  CreatePaymentDto,
  CreatePaymentAddressDto as CommonCreatePaymentAddressDto,
} from '../dto/request/common';
import { ApiCallCartItemInterface } from '../../common/interfaces';
import * as _ from 'lodash';
import { OrderModel } from '../models';
import { OrderService } from '../services/order.service';
import { PaymentLinkInterface } from '../../payment-links/interfaces';
import { ApiVersionEnum, PosVerifyTypesEnum, TwoFactorTypeEnum, VerifyTypeEnum } from '../enum';

@Injectable()
export class CreatePaymentDtoTransformer {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  public static v1CreatePaymentWrapperDtoToCommonCreatePayment(
    paymentWrapperDto: V1CreatePaymentWrapperDto,
  ): CreatePaymentDto {
    const createPaymentDto: CreatePaymentDto = {
      payment_method: paymentWrapperDto.payment_method,
      channel: paymentWrapperDto.channel,
      channel_type: paymentWrapperDto.channel_type,
      channel_source: paymentWrapperDto.channel_source,
      channel_set_id: paymentWrapperDto.channel_set_id,
      amount: paymentWrapperDto.amount,
      fee: paymentWrapperDto.fee,
      original_cart: paymentWrapperDto.cart,
      cart: CreatePaymentDtoTransformer.convertCart(paymentWrapperDto.cart),
      order_id: paymentWrapperDto.order_id,
      currency: paymentWrapperDto.currency,
      salutation: paymentWrapperDto.salutation,
      first_name: paymentWrapperDto.first_name,
      last_name: paymentWrapperDto.last_name,
      street: paymentWrapperDto.street,
      street_number: paymentWrapperDto.street_number,
      zip: paymentWrapperDto.zip,
      region: paymentWrapperDto.region,
      country: paymentWrapperDto.country,
      city: paymentWrapperDto.city,
      address_line_2: paymentWrapperDto.address_line_2,
      birthdate: paymentWrapperDto.birthdate,
      phone: paymentWrapperDto.phone,
      email: paymentWrapperDto.email,
      success_url: paymentWrapperDto.success_url,
      pending_url: paymentWrapperDto.pending_url,
      failure_url: paymentWrapperDto.failure_url,
      cancel_url: paymentWrapperDto.cancel_url,
      notice_url: paymentWrapperDto.notice_url,
      customer_redirect_url: paymentWrapperDto.customer_redirect_url,
      x_frame_host: paymentWrapperDto.x_frame_host,
      variant_id: paymentWrapperDto.variant_id,
      allow_cart_step: paymentWrapperDto.allow_cart_step,
      use_inventory: paymentWrapperDto.use_inventory,
      expires_at: paymentWrapperDto.expires_at,
      extra: paymentWrapperDto.extra,
      shipping_address: CreatePaymentDtoTransformer.parsePossibleString(paymentWrapperDto.shipping_address),
      locale: paymentWrapperDto.locale,
      payment_data: paymentWrapperDto.payment_data,
      reusable: paymentWrapperDto.reusable,
      client_ip: paymentWrapperDto.client_ip,
      skip_handle_payment_fee: true,
      plugin_version: paymentWrapperDto.plugin_version,
      api_version: ApiVersionEnum.v1,
      verify_two_factor: paymentWrapperDto.verify_two_factor,
      verify_type: paymentWrapperDto.verify_type,
    };

    return CreatePaymentDtoTransformer.updateVerifyValuesInPaymentData(createPaymentDto);
  }

  public static v2CreatePaymentWrapperDtoToCommonCreatePayment(
    paymentWrapperDto: V2CreatePaymentWrapperDto,
  ): CreatePaymentDto {
    const createPaymentDto: CreatePaymentDto = {
      payment_method: paymentWrapperDto.payment_method,
      channel: paymentWrapperDto.channel?.name,
      channel_type: paymentWrapperDto.channel?.type,
      channel_source: paymentWrapperDto.channel?.source,
      channel_set_id: paymentWrapperDto.channel?.channel_set_id,
      amount: paymentWrapperDto.amount,
      fee: paymentWrapperDto.fee,
      down_payment: paymentWrapperDto.down_payment,
      original_cart: paymentWrapperDto.cart,
      cart: CreatePaymentDtoTransformer.convertCart(paymentWrapperDto.cart),
      order_id: paymentWrapperDto.order_id,
      currency: paymentWrapperDto.currency,
      salutation: paymentWrapperDto.billing_address?.salutation,
      first_name: paymentWrapperDto.billing_address?.first_name,
      last_name: paymentWrapperDto.billing_address?.last_name,
      street: paymentWrapperDto.billing_address?.street,
      street_number: paymentWrapperDto.billing_address?.street_number,
      zip: paymentWrapperDto.billing_address?.zip,
      region: paymentWrapperDto.billing_address?.region,
      country: paymentWrapperDto.billing_address?.country,
      city: paymentWrapperDto.billing_address?.city,
      address_line_2: paymentWrapperDto.billing_address?.address_line_2,
      birthdate: paymentWrapperDto.birthdate,
      plugin_version: paymentWrapperDto.plugin_version,
      phone: paymentWrapperDto.phone,
      email: paymentWrapperDto.email,
      success_url: paymentWrapperDto.success_url,
      pending_url: paymentWrapperDto.pending_url,
      failure_url: paymentWrapperDto.failure_url,
      cancel_url: paymentWrapperDto.cancel_url,
      notice_url: paymentWrapperDto.notice_url,
      customer_redirect_url: paymentWrapperDto.customer_redirect_url,
      x_frame_host: paymentWrapperDto.x_frame_host,
      variant_id: paymentWrapperDto.variant_id,
      allow_cart_step: paymentWrapperDto.allow_cart_step,
      use_inventory: paymentWrapperDto.use_inventory,
      expires_at: paymentWrapperDto.expires_at,
      extra: paymentWrapperDto.extra,
      shipping_address: paymentWrapperDto.shipping_address,
      locale: paymentWrapperDto.locale,
      payment_data: paymentWrapperDto.payment_data,
      verify_type: paymentWrapperDto?.verify?.type,
      verify_two_factor: paymentWrapperDto?.verify?.two_factor,
      seller: paymentWrapperDto.seller,
      reusable: paymentWrapperDto.reusable,
      link_message: paymentWrapperDto.link_message,
      client_ip: paymentWrapperDto.client_ip,
      skip_handle_payment_fee: true,
      api_version: ApiVersionEnum.v2,
      privacy: paymentWrapperDto.privacy,
    };

    return CreatePaymentDtoTransformer.updateVerifyValuesInPaymentData(createPaymentDto);
  }

  public async v3CreatePaymentWrapperDtoToCommonCreatePayment(
    paymentWrapperDto: V3CreatePaymentWrapperDto,
    skipDefault: boolean = false,
  ): Promise<CreatePaymentDto> {
    let order: OrderModel;
    if (paymentWrapperDto.order_id) {
      order = await this.orderService.getPlainOrderById(paymentWrapperDto.order_id);
    }

    const createPaymentDto: CreatePaymentDto = {
      payment_method: paymentWrapperDto.payment_method,
      payment_issuer: paymentWrapperDto.payment_issuer,
      channel: paymentWrapperDto.channel?.name,
      channel_type: paymentWrapperDto.channel?.type,
      channel_source: paymentWrapperDto.channel?.source,
      channel_set_id: paymentWrapperDto.channel?.channel_set_id,
      amount: paymentWrapperDto.purchase?.amount || order?.purchase?.amount || (skipDefault ? undefined: 0),
      fee: paymentWrapperDto.purchase?.delivery_fee || order?.purchase?.delivery_fee || (skipDefault ? undefined: 0),
      down_payment:
        paymentWrapperDto.purchase?.down_payment || order?.purchase?.down_payment || (skipDefault ? undefined: 0),
      original_cart: paymentWrapperDto.cart,
      cart: CreatePaymentDtoTransformer.convertV3Cart(paymentWrapperDto.cart || order?.cart),
      order_id: paymentWrapperDto.reference || order?.reference,
      currency: paymentWrapperDto.purchase?.currency || order?.purchase?.currency,
      salutation: paymentWrapperDto.billing_address?.salutation || order?.billing_address?.salutation,
      first_name: paymentWrapperDto.billing_address?.first_name || order?.billing_address?.first_name,
      last_name: paymentWrapperDto.billing_address?.last_name || order?.billing_address?.last_name,
      street: paymentWrapperDto.billing_address?.street || order?.billing_address?.street,
      street_name: paymentWrapperDto.billing_address?.street_name || order?.billing_address?.street_name,
      street_number: paymentWrapperDto.billing_address?.street_number || order?.billing_address?.street_number,
      zip: paymentWrapperDto.billing_address?.zip || order?.billing_address?.zip,
      region: paymentWrapperDto.billing_address?.region || order?.billing_address?.region,
      country: paymentWrapperDto.billing_address?.country || order?.billing_address?.country,
      city: paymentWrapperDto.billing_address?.city || order?.billing_address?.city,
      address_line_2: paymentWrapperDto.billing_address?.street_line_2 || order?.billing_address?.street_line_2,
      birthdate: paymentWrapperDto.customer?.birthdate || order?.customer?.birthdate,
      phone: paymentWrapperDto.customer?.phone || order?.customer?.phone,
      email: paymentWrapperDto.customer?.email || order?.customer?.email,
      success_url: paymentWrapperDto.urls?.success,
      pending_url: paymentWrapperDto.urls?.pending,
      failure_url: paymentWrapperDto.urls?.failed,
      cancel_url: paymentWrapperDto.urls?.cancel,
      notice_url: paymentWrapperDto.urls?.notification,
      customer_redirect_url: paymentWrapperDto.urls?.redirect,
      x_frame_host: paymentWrapperDto.x_frame_host,
      variant_id: paymentWrapperDto.variant_id,
      allow_cart_step: paymentWrapperDto.options?.allow_cart_step,
      use_inventory: paymentWrapperDto.options?.use_inventory,
      expires_at: paymentWrapperDto.expires_at,
      extra: paymentWrapperDto.extra,
      shipping_address: paymentWrapperDto.shipping_address || order?.shipping_address,
      locale: paymentWrapperDto.locale,
      payment_data: paymentWrapperDto.payment_data,
      verify_type: paymentWrapperDto?.verify?.type,
      verify_two_factor: paymentWrapperDto?.verify?.two_factor,
      seller: paymentWrapperDto.seller,
      reusable: paymentWrapperDto.options?.reusable,
      client_ip: paymentWrapperDto.client_ip,
      user_agent: paymentWrapperDto.device?.browser?.user_agent,
      skip_handle_payment_fee: true,
      plugin_version: paymentWrapperDto.plugin_version,

      reference_extra: paymentWrapperDto.reference_extra,
      purchase_country: paymentWrapperDto.purchase?.country,
      customer_type: paymentWrapperDto.customer?.type,
      customer_gender: paymentWrapperDto.customer?.gender,
      company: paymentWrapperDto.company,
      organization_name:
        paymentWrapperDto.billing_address?.organization_name || order?.billing_address?.organization_name,
      house_extension: paymentWrapperDto.billing_address?.house_extension || order?.billing_address?.house_extension,
      shipping_option: paymentWrapperDto.shipping_option,
      splits: paymentWrapperDto.splits,
      allow_separate_shipping_address: paymentWrapperDto.options?.allow_separate_shipping_address,
      allow_customer_types: paymentWrapperDto.options?.allow_customer_types,
      allow_payment_methods: paymentWrapperDto.options?.allow_payment_methods,
      allow_billing_step: paymentWrapperDto.options?.allow_billing_step,
      allow_shipping_step: paymentWrapperDto.options?.allow_shipping_step,
      use_styles: paymentWrapperDto.options?.use_styles,
      use_default_variant: paymentWrapperDto.options?.use_default_variant,
      use_iframe: paymentWrapperDto.options?.use_iframe,
      salutation_mandatory: paymentWrapperDto.options?.salutation_mandatory,
      phone_mandatory: paymentWrapperDto.options?.phone_mandatory,
      birthdate_mandatory: paymentWrapperDto.options?.birthdate_mandatory,
      test_mode: paymentWrapperDto.options?.test_mode || (skipDefault ? undefined : false),
      order_ref: order?._id,
      api_version: ApiVersionEnum.v3,
      privacy: paymentWrapperDto.privacy,
      link_message: paymentWrapperDto.link_message,
      footer_urls: paymentWrapperDto.urls?.footer,
      hide_logo: paymentWrapperDto.options?.hide_logo,
      hide_imprint: paymentWrapperDto.options?.hide_imprint,
      auto_capture_enabled: paymentWrapperDto.options?.auto_capture_enabled,
      auto_capture_date: paymentWrapperDto.options?.auto_capture_date,
      disable_validation: paymentWrapperDto.options?.disable_validation,
    };

    return CreatePaymentDtoTransformer.updateVerifyValuesInPaymentData(createPaymentDto);
  }

  public static paymentLinkToV2CreatePaymentWrapperDtoTo(
    paymentLink: PaymentLinkInterface,
  ): V2CreatePaymentWrapperDto {
    const result: V2CreatePaymentWrapperDto = {
      billing_address: {
        salutation: paymentLink.salutation,
        first_name: paymentLink.first_name,
        last_name: paymentLink.last_name,
        street: paymentLink.street,
        street_number: paymentLink.street_number,
        zip: paymentLink.zip,
        region: paymentLink.region,
        country: paymentLink.country,
        city: paymentLink.city,
        address_line_2: paymentLink.address_line_2,
      },
      payment_method: paymentLink.payment_method,
      channel: {
        name: paymentLink.channel,
        type: paymentLink.channel_type,
        source: paymentLink.channel_source,
        channel_set_id: paymentLink.channel_set_id,
      },
      amount: paymentLink.amount,
      fee: paymentLink.fee,
      down_payment: paymentLink.down_payment,
      cart: paymentLink.original_cart,
      order_id: paymentLink.order_id,
      currency: paymentLink.currency,
      birthdate: paymentLink.birthdate,
      plugin_version: paymentLink.plugin_version,
      phone: paymentLink.phone,
      email: paymentLink.email,
      success_url: paymentLink.success_url,
      pending_url: paymentLink.pending_url,
      failure_url: paymentLink.failure_url,
      cancel_url: paymentLink.cancel_url,
      notice_url: paymentLink.notice_url,
      customer_redirect_url: paymentLink.customer_redirect_url,
      x_frame_host: paymentLink.x_frame_host,
      variant_id: paymentLink.variant_id,
      allow_cart_step: paymentLink.allow_cart_step,
      use_inventory: paymentLink.use_inventory,
      expires_at: paymentLink.expires_at,
      extra: paymentLink.extra,
      shipping_address: CreatePaymentDtoTransformer.convertShippingAddressToV2(paymentLink.shipping_address),
      locale: paymentLink.locale,
      payment_data: paymentLink.payment_data,
      verify: {
        type: paymentLink.verify_type,
        two_factor: paymentLink.verify_two_factor,
      },
      seller: paymentLink.seller,
      reusable: paymentLink.reusable,
      link_message: paymentLink.link_message,
      client_ip: paymentLink.client_ip,
    };

    return {
      _id: paymentLink._id,
      business_id: paymentLink.business_id,
      created_at: paymentLink.created_at,
      ...result,
    } as any;
  }

  public static paymentLinkToV3CreatePaymentWrapperDtoTo(
    paymentLink: PaymentLinkInterface,
  ): V3CreatePaymentWrapperDto {
    const result: V3CreatePaymentWrapperDto = {
      billing_address: {
        salutation: paymentLink.salutation,
        first_name: paymentLink.first_name,
        last_name: paymentLink.last_name,
        street: paymentLink.street,
        street_name: paymentLink.street_name,
        street_number: paymentLink.street_number,
        zip: paymentLink.zip,
        region: paymentLink.region,
        country: paymentLink.country,
        city: paymentLink.city,
        street_line_2: paymentLink.address_line_2,
        house_extension: paymentLink.house_extension,
        organization_name: paymentLink.organization_name,
      },
      cart: paymentLink.original_cart,
      channel: {
        name: paymentLink.channel,
        type: paymentLink.channel_type,
        source: paymentLink.channel_source,
        channel_set_id: paymentLink.channel_set_id,
      },
      client_ip: paymentLink.client_ip,
      company: paymentLink.company,
      customer: {
        type: paymentLink.customer_type,
        gender: paymentLink.customer_gender,
        birthdate: paymentLink.birthdate,
        phone: paymentLink.phone,
        email: paymentLink.email,

      },
      expires_at: paymentLink.expires_at,
      extra: paymentLink.extra,
      locale: paymentLink.locale,
      options: {
        allow_billing_step: paymentLink.allow_billing_step,
        allow_cart_step: paymentLink.allow_cart_step,
        allow_customer_types: paymentLink.allow_customer_types,
        allow_payment_methods: paymentLink.allow_payment_methods,
        allow_separate_shipping_address: paymentLink.allow_separate_shipping_address,
        allow_shipping_step: paymentLink.allow_shipping_step,
        use_inventory: paymentLink.use_inventory,
        use_styles: paymentLink.use_styles,
        use_default_variant: paymentLink.use_default_variant,
        use_iframe: paymentLink.use_iframe,
        salutation_mandatory: paymentLink.salutation_mandatory,
        phone_mandatory: paymentLink.phone_mandatory,
        birthdate_mandatory: paymentLink.phone_mandatory,
        test_mode: paymentLink.test_mode,
        reusable: paymentLink.reusable,
      },
      order_id: paymentLink.order_id,
      payment_data: paymentLink.payment_data,
      payment_method: paymentLink.payment_method,
      plugin_version: paymentLink.plugin_version,
      purchase: {
        amount: paymentLink.amount,
        delivery_fee: paymentLink.fee,
        down_payment: paymentLink.down_payment,
        currency: paymentLink.currency,
        country: paymentLink.purchase_country,
      },
      reference: paymentLink.order_ref,
      reference_extra: paymentLink.reference_extra,
      seller: paymentLink.seller,
      shipping_address: CreatePaymentDtoTransformer.convertShippingAddressToV3(paymentLink.shipping_address),
      shipping_option: paymentLink.shipping_option,
      splits: paymentLink.splits,
      urls: {
        success: paymentLink.success_url,
        pending: paymentLink.pending_url,
        failed: paymentLink.failure_url,
        cancel: paymentLink.cancel_url,
        notification: paymentLink.notice_url,
        redirect: paymentLink.customer_redirect_url,
      },
      variant_id: paymentLink.variant_id,
      verify: {
        type: paymentLink.verify_type,
        two_factor: paymentLink.verify_two_factor,
      },
      x_frame_host: paymentLink.x_frame_host,
      link_message: paymentLink.link_message,
    };

    return {
      _id: paymentLink._id,
      business_id: paymentLink.business_id,
      created_at: paymentLink.created_at,
      ...result,
    } as any;
  }

  private static parsePossibleString(value: any): any {
    return (typeof value === 'string') ? JSON.parse(value) : value;
  }

  private static convertCart(cart: any): any {
    cart = CreatePaymentDtoTransformer.parsePossibleString(cart);

    if (!cart || !cart.length) {
      return cart;
    }

    cart = cart.map((item: any) => {
      if (!Object.keys(item).length) {
        return null;
      }

      return {
        ..._.mapKeys(item, (v: any, k: string) => _.snakeCase(k)),
      };
    });

    return cart.filter((item: any) => !!item);
  }

  private static convertV3Cart(originalCart: V3CreatePaymentItemDto[] | string): ApiCallCartItemInterface[] {
    const cart: V3CreatePaymentItemDto[] = this.convertCart(originalCart);

    if (!cart || !cart.length) {
      return null;
    }

    return cart.map((cartItem: V3CreatePaymentItemDto) => {
      const vatRate: number = cartItem.tax_rate ? cartItem.tax_rate : 0;
      const priceNetto: number = cartItem.unit_price / (1 + vatRate / 100);
      const roundedPriceNetto: number = Math.round((priceNetto + Number.EPSILON) * 100) / 100;

      return {
        description: cartItem.description,
        identifier: cartItem.identifier,
        name: cartItem.name,
        price_netto: roundedPriceNetto,
        price: cartItem.unit_price,
        quantity: cartItem.quantity,
        sku: cartItem.sku,
        vat_rate: vatRate,

        brand: cartItem.brand,
        total_amount: cartItem.total_amount,
        total_tax_amount: cartItem.total_tax_amount,
        total_discount_amount: cartItem.total_discount_amount,
        image_url: cartItem.image_url,
        product_url: cartItem.product_url,
        category: cartItem.category,
        attributes: cartItem.attributes,
        type: cartItem.type,
      };
    });
  }

  private static convertShippingAddressToV3(commonAddress: CommonCreatePaymentAddressDto): V3CreatePaymentAddressDto {
    if (!commonAddress) {
      return undefined;
    }

    return {
      salutation: commonAddress.salutation,
      first_name: commonAddress.first_name,
      last_name: commonAddress.last_name,
      street: commonAddress.street,
      street_number: commonAddress.street_number,
      zip: commonAddress.zip,
      region: commonAddress.region,
      country: commonAddress.country,
      city: commonAddress.city,
      street_line_2: commonAddress.address_line_2,
      organization_name: commonAddress.organization_name,
      street_name: commonAddress.street_name,
      house_extension: commonAddress.house_extension,
    };
  }

  private static convertShippingAddressToV2(commonAddress: CommonCreatePaymentAddressDto): V2CreatePaymentAddressDto {
    if (!commonAddress) {
      return undefined;
    }

    return {
      salutation: commonAddress.salutation,
      first_name: commonAddress.first_name,
      last_name: commonAddress.last_name,
      street: commonAddress.street,
      street_number: commonAddress.street_number,
      zip: commonAddress.zip,
      region: commonAddress.region,
      country: commonAddress.country,
      city: commonAddress.city,
      address_line_2: commonAddress.address_line_2,
    };
  }

  private static updateVerifyValuesInPaymentData(createPaymentDto: CreatePaymentDto): CreatePaymentDto {
    if (createPaymentDto.verify_type) {
      createPaymentDto.payment_data = {
        ...createPaymentDto.payment_data,
        posVerifyType: CreatePaymentDtoTransformer.getPosVerifyType(
          createPaymentDto?.verify_type,
          createPaymentDto.payment_data?.posVerifyType,
        ),
      };
    }

    if (createPaymentDto.verify_two_factor) {
      createPaymentDto.payment_data = {
        ...createPaymentDto.payment_data,
        posMerchantMode: createPaymentDto.verify_two_factor
          ? createPaymentDto?.verify_two_factor !== TwoFactorTypeEnum.none
          : createPaymentDto.payment_data?.posMerchantMode
            ? createPaymentDto.payment_data?.posMerchantMode
            : undefined,
      };
    }

    return createPaymentDto;
  }

  private static getPosVerifyType(verifyType: VerifyTypeEnum, posVerifyType: PosVerifyTypesEnum): PosVerifyTypesEnum {
    let result: PosVerifyTypesEnum = posVerifyType;

    if (verifyType) {
      switch (verifyType) {
        case VerifyTypeEnum.code:
          result = PosVerifyTypesEnum.verifyByCode;
          break;
        case VerifyTypeEnum.id:
          result = PosVerifyTypesEnum.verifyById;
          break;
        case VerifyTypeEnum.custom:
          result = PosVerifyTypesEnum.verifyByCode;
          break;
      }
    }

    return result;
  }

}
