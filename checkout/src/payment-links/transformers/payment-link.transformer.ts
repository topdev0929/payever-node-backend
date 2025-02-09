/* eslint-disable @typescript-eslint/tslint/config */
import { PaymentLinkPrivacyDto, PaymentLinkResultDto, PaymentLinkFolderItemDto } from '../dto';
import { CreatePaymentDto } from '../../legacy-api';
import { PaymentLinkInterface } from '../interfaces';
import { environment } from '../../environments';
import * as querystring from 'querystring';
import * as _ from 'lodash';
import { PaymentLinkModel } from '../models';
import { MappedFolderItemInterface } from '@pe/folders-plugin';

export class PaymentLinkTransformer {

  public static paymentLinkToCommonCreatePayment(
    paymentLink: PaymentLinkInterface,
    privacyData: PaymentLinkPrivacyDto,
  ): CreatePaymentDto {

    return {
      payment_method: paymentLink.payment_method,
      channel: paymentLink.channel,
      channel_type: paymentLink.channel_type,
      channel_source: paymentLink.channel_source,
      channel_set_id: paymentLink.channel_set_id,
      amount: paymentLink.amount,
      fee: paymentLink.fee,
      down_payment: paymentLink.down_payment,
      original_cart: paymentLink.original_cart,
      cart: paymentLink.cart,
      order_id: paymentLink.reference ?? paymentLink.order_id,
      currency: paymentLink.currency,
      salutation:
        privacyData.billing_address_salutation ? privacyData.billing_address_salutation : paymentLink.salutation,
      first_name:
        privacyData.billing_address_first_name ? privacyData.billing_address_first_name : paymentLink.first_name,
      last_name: privacyData.billing_address_last_name ? privacyData.billing_address_last_name : paymentLink.last_name,
      street: privacyData.billing_address_street ? privacyData.billing_address_street : paymentLink.street,
      street_number: privacyData.billing_address_street_number
        ? privacyData.billing_address_street_number
        : paymentLink.street_number,
      zip: privacyData.billing_address_zip ? privacyData.billing_address_zip : paymentLink.zip,
      region: privacyData.billing_address_region ? privacyData.billing_address_region : paymentLink.region,
      country: privacyData.billing_address_country ? privacyData.billing_address_country : paymentLink.country,
      city: privacyData.billing_address_city ? privacyData.billing_address_city : paymentLink.city,
      address_line_2: privacyData.billing_address_address_line_2
        ? privacyData.billing_address_address_line_2
        : paymentLink.address_line_2,
      organization_name: privacyData.billing_address_organization_name
        ? privacyData.billing_address_organization_name
        : paymentLink.organization_name,
      street_line_2: privacyData.billing_address_street_line_2
        ? privacyData.billing_address_street_line_2
        : paymentLink.organization_name,
      street_name:
        privacyData.billing_address_street_name ? privacyData.billing_address_street_name : paymentLink.street_name,
      house_extension: privacyData.billing_address_house_extension
        ? privacyData.billing_address_house_extension
        : paymentLink.house_extension,

      birthdate: privacyData.birthdate ? new Date(privacyData.birthdate) : paymentLink.birthdate,
      phone: privacyData.phone ? privacyData.phone : paymentLink.phone,
      email: privacyData.email ? privacyData.email : paymentLink.email,
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
      shipping_address: {
        salutation:
          privacyData.shipping_address_salutation 
            ? privacyData.shipping_address_salutation 
            : paymentLink.shipping_address?.salutation,
        first_name:
          privacyData.shipping_address_first_name 
            ? privacyData.shipping_address_first_name 
            : paymentLink.shipping_address?.first_name,
        last_name:
          privacyData.shipping_address_last_name 
            ? privacyData.shipping_address_last_name 
            : paymentLink.shipping_address?.last_name,
        street: privacyData.shipping_address_street 
          ? privacyData.shipping_address_street 
          : paymentLink.shipping_address?.street,
        street_number: privacyData.shipping_address_street_number
          ? privacyData.shipping_address_street_number
          : paymentLink.shipping_address?.street_number,
        zip: privacyData.shipping_address_zip 
          ? privacyData.shipping_address_zip 
          : paymentLink.shipping_address?.zip,
        region: privacyData.shipping_address_region 
          ? privacyData.shipping_address_region 
          : paymentLink.shipping_address?.region,
        country: privacyData.shipping_address_country 
          ? privacyData.shipping_address_country 
          : paymentLink.shipping_address?.country,
        city: privacyData.shipping_address_city 
          ? privacyData.shipping_address_city 
          : paymentLink.shipping_address?.city,
        address_line_2: privacyData.shipping_address_address_line_2
          ? privacyData.shipping_address_address_line_2
          : paymentLink.shipping_address?.address_line_2,
        organization_name: privacyData.shipping_address_organization_name
          ? privacyData.shipping_address_organization_name
          : paymentLink.shipping_address?.organization_name,
        street_line_2: privacyData.shipping_address_street_line_2
          ? privacyData.shipping_address_street_line_2
          : paymentLink.shipping_address?.organization_name,
        street_name: privacyData.shipping_address_street_name 
          ? privacyData.shipping_address_street_name 
          : paymentLink.shipping_address?.street_name,
        house_extension: privacyData.shipping_address_house_extension
          ? privacyData.shipping_address_house_extension
          : paymentLink.shipping_address?.house_extension,
      },
      locale: paymentLink.locale,
      payment_data: paymentLink.payment_data,
      verify_type: paymentLink?.verify_type,
      verify_two_factor: paymentLink?.verify_two_factor,
      seller: paymentLink.seller,
      reusable: paymentLink.reusable,
      client_ip: paymentLink.client_ip,
      skip_handle_payment_fee: true,
      plugin_version: paymentLink.plugin_version,

      reference_extra: paymentLink.reference_extra,
      purchase_country: paymentLink.purchase_country,
      customer_type: paymentLink.customer_type,
      customer_gender: paymentLink.customer_gender,
      company: paymentLink.company,
      shipping_option: paymentLink.shipping_option,
      splits: paymentLink.splits,
      allow_separate_shipping_address: paymentLink.allow_separate_shipping_address,
      allow_customer_types: paymentLink.allow_customer_types,
      allow_payment_methods: paymentLink.allow_payment_methods,
      allow_billing_step: paymentLink.allow_billing_step,
      allow_shipping_step: paymentLink.allow_shipping_step,
      use_styles: paymentLink.use_styles,
      use_default_variant: paymentLink.use_default_variant,
      use_iframe: paymentLink.use_iframe,
      salutation_mandatory: paymentLink.salutation_mandatory,
      phone_mandatory: paymentLink.phone_mandatory,
      birthdate_mandatory: paymentLink.birthdate_mandatory,
      test_mode: paymentLink.test_mode ,
      order_ref: paymentLink.order_ref,
      payment_link_id: paymentLink._id,
    };
  }

  public static prepareRedirectUrl(createPayment: CreatePaymentDto | PaymentLinkResultDto): string {
    let redirectUrl: string =
      `${environment.checkoutMicroUrl}/payment/link/PAYMENT_LINK_ID`;

    if (createPayment.privacy) {
      const paymentLinkPrivacyData: PaymentLinkPrivacyDto =
        PaymentLinkTransformer.paymentWrapperToPaymentLinkPrivacy(createPayment);

      for (const key of Object.keys(paymentLinkPrivacyData)) {
        if (!paymentLinkPrivacyData[key]) {
          delete paymentLinkPrivacyData[key];
        }
      }
      redirectUrl = `${redirectUrl}?${querystring.stringify(paymentLinkPrivacyData as any)}`;
    }

    return redirectUrl;
  }

  public static paymentWrapperToPaymentLinkPrivacy(
    createPayment: CreatePaymentDto | PaymentLinkResultDto,
  ): PaymentLinkPrivacyDto {
    return {
      billing_address_address_line_2: createPayment.address_line_2,
      billing_address_city: createPayment.city,
      billing_address_country: createPayment.country,
      billing_address_first_name: createPayment.first_name,
      billing_address_last_name: createPayment.last_name,
      billing_address_region: createPayment.region,
      billing_address_salutation: createPayment.salutation,
      billing_address_street: createPayment.street,
      billing_address_street_number: createPayment.street_number,
      billing_address_zip: createPayment.zip,
      birthdate: createPayment.birthdate ? createPayment.birthdate.toString() : undefined,
      email: createPayment.email,
      phone: createPayment.phone,
      shipping_address_address_line_2: createPayment.shipping_address?.address_line_2,
      shipping_address_city: createPayment.shipping_address?.city,
      shipping_address_country: createPayment.shipping_address?.country,
      shipping_address_first_name: createPayment.shipping_address?.first_name,
      shipping_address_last_name: createPayment.shipping_address?.last_name,
      shipping_address_region: createPayment.shipping_address?.region,
      shipping_address_salutation: createPayment.shipping_address?.salutation,
      shipping_address_street: createPayment.shipping_address?.street,
      shipping_address_street_number: createPayment.shipping_address?.street_number,
      shipping_address_zip: createPayment.shipping_address?.zip,
    };
  }

  public static convertKeysToCamelCase(dto: object): object {
    return  _.transform(dto, (r: object, v: any, k: string) => {
      r[_.camelCase(k)] = (typeof v === 'object' && !(v instanceof Date)) ? this.convertKeysToCamelCase(v) : v;
    });

  }

  public static paymentLinkModelToPaymentLinkFolderItem(
    paymentLinkModel: PaymentLinkModel,
  ): PaymentLinkFolderItemDto {
    return {
      _id: paymentLinkModel._id,
      businessId: paymentLinkModel.business_id,
      amount: paymentLinkModel.amount,
      createdAt: paymentLinkModel.created_at,
      expiresAt: paymentLinkModel.expires_at,
      isActive: paymentLinkModel.is_active,
      creator: paymentLinkModel.creator,
      isDeleted: paymentLinkModel.is_deleted,
      transactionsCount: paymentLinkModel.transactions_count,
      viewsCount: paymentLinkModel.views_count,
    };
  }

}

export function mapPaymentLinkFolderItem(
  paymentLinkModel: PaymentLinkModel,
): MappedFolderItemInterface {
  return PaymentLinkTransformer.paymentLinkModelToPaymentLinkFolderItem(paymentLinkModel) as any;
}
