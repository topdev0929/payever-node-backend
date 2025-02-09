import { PaymentLinkAddressInterface } from './payment-link-address.interface';
import { PaymentLinkSellerInterface } from './payment-link-seller.interface';
import { PaymentLinkMessageInterface } from './payment-link-message.interface';
import { ApiCallCartItemInterface } from '../../common/interfaces';
import { VerifyTypeEnum, TwoFactorTypeEnum, PaymentMethodEnum } from '../../legacy-api/enum';
import { CreatePaymentCompanyDto, CreatePaymentShippingOptionDto, CreatePaymentSplitDto } from '../../legacy-api/dto';
import { CustomerTypeEnum } from '../../common/enum';

export interface PaymentLinkInterface {
  _id?: any;
  business_id?: string;
  channel?: string;
  channel_type?: string;
  channel_source?: string;
  channel_set_id?: number;
  amount?: number;
  reference?: string;
  fee?: number;
  cart?: ApiCallCartItemInterface[];
  order_id?: string;
  currency?: string;
  social_security_number?: string;
  birthdate?: Date;
  phone?: string;
  email?: string;
  success_url?: string;
  pending_url?: string;
  failure_url?: string;
  cancel_url?: string;
  notice_url?: string;
  customer_redirect_url?: string;
  x_frame_host?: string;
  plugin_version?: string;
  variant_id?: string;
  allow_cart_step?: boolean;
  use_inventory?: boolean;
  expires_at?: Date;
  extra?: any;
  client_id?: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  street_number?: string;
  zip?: string;
  country?: string;
  region?: string;
  city?: string;
  address_line_2?: string;
  organization_name?: string;
  street_name?: string;
  house_extension?: string;
  shipping_address?: PaymentLinkAddressInterface;
  locale?: string;
  verify_type?: VerifyTypeEnum;
  verify_two_factor?: TwoFactorTypeEnum;
  seller?: PaymentLinkSellerInterface;
  payment_data?: any;
  reusable?: boolean;
  link_message?: PaymentLinkMessageInterface;
  skip_handle_payment_fee?: boolean;
  client_ip?: string;

  reference_extra?: string;
  purchase_country?: string;
  customer_type?: CustomerTypeEnum;
  customer_gender?: string;
  company?: CreatePaymentCompanyDto;
  shipping_option?: CreatePaymentShippingOptionDto;
  splits?: CreatePaymentSplitDto[];
  allow_separate_shipping_address?: boolean;
  allow_customer_types?: CustomerTypeEnum[];
  allow_payment_methods?: PaymentMethodEnum[];
  allow_billing_step?: boolean;
  allow_shipping_step?: boolean;
  use_styles?: boolean;
  use_default_variant?: boolean;
  use_iframe?: boolean;
  salutation_mandatory?: boolean;
  phone_mandatory?: boolean;
  birthdate_mandatory?: boolean;
  test_mode?: boolean;
  api_version?: string;
  order_ref?: string;
  original_cart?: any;

  down_payment?: number;
  payment_method?: PaymentMethodEnum;

  created_at?: Date;
  privacy?: boolean;

  is_deleted?: boolean;
  is_active?: boolean;

  creator?: string;

  api_call_id?: string;
  payment_id?: string;

  transactions_count?: number;
  views_count?: number;
}
