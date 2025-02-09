import {
  PaymentLinkInterface,
  PaymentLinkAddressInterface,
  PaymentLinkSellerInterface,
  PaymentLinkMessageInterface,
} from '../../interfaces';
import { ApiCallCartItemInterface } from '../../../common/interfaces';
import { Exclude, Expose } from 'class-transformer';
import {
  VerifyTypeEnum,
  TwoFactorTypeEnum,
  PaymentMethodEnum,
} from '../../../legacy-api/enum';
import {
  CreatePaymentCompanyDto,
  CreatePaymentShippingOptionDto,
  CreatePaymentSplitDto,
} from '../../../legacy-api/dto';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerTypeEnum } from '../../../common/enum';

@Exclude()
export class PaymentLinkResultDto implements PaymentLinkInterface {
  @Expose()
  @ApiProperty({ name: '_id', required: false})
  public _id?: any;

  @Expose()
  @ApiProperty({ name: 'redirectUrl', required: false})
  public redirect_url?: string;

  @Expose()
  @ApiProperty({ name: 'addressLine2', required: false})
  public address_line_2?: string;

  @Expose()
  @ApiProperty({ name: 'allowBillingStep', required: false})
  public allow_billing_step?: boolean;

  @Expose()
  @ApiProperty({ name: 'allowCartStep', required: false})
  public allow_cart_step?: boolean;

  @Expose()
  @ApiProperty({ name: 'allowCustomerTypes', required: false, enum: CustomerTypeEnum, isArray: true})
  public allow_customer_types?: CustomerTypeEnum[];

  @Expose()
  @ApiProperty({ name: 'allowPaymentMethods', required: false, enum: PaymentMethodEnum, isArray: true})
  public allow_payment_methods?: PaymentMethodEnum[];

  @Expose()
  @ApiProperty({ name: 'allowSeparateShippingAddress', required: false})
  public allow_separate_shipping_address?: boolean;

  @Expose()
  @ApiProperty({ name: 'allowShippingStep', required: false})
  public allow_shipping_step?: boolean;

  @Expose()
  @ApiProperty({ name: 'amount', required: false})
  public amount?: number;

  @Expose()
  @ApiProperty({ name: 'reference', required: false})
  public reference?: string;

  @Expose()
  @ApiProperty({ name: 'apiVersion', required: false})
  public api_version?: string;

  @Expose()
  @ApiProperty({ name: 'birthdate', required: false})
  public birthdate?: Date;

  @Expose()
  @ApiProperty({ name: 'birthdateMandatory', required: false})
  public birthdate_mandatory?: boolean;

  @Expose()
  @ApiProperty({ name: 'businessId', required: false})
  public business_id?: string;

  @Expose()
  @ApiProperty({ name: 'cancelUrl', required: false})
  public cancel_url?: string;

  @Expose()
  @ApiProperty({ name: 'cart', required: false})
  public cart?: ApiCallCartItemInterface[];

  @Expose()
  @ApiProperty({ name: 'channel', required: false})
  public channel?: string;

  @Expose()
  @ApiProperty({ name: 'channelSetId', required: false})
  public channel_set_id?: number;

  @Expose()
  @ApiProperty({ name: 'channelSource', required: false})
  public channel_source?: string;

  @Expose()
  @ApiProperty({ name: 'channelType', required: false})
  public channel_type?: string;

  @Expose()
  @ApiProperty({ name: 'city', required: false})
  public city?: string;

  @Expose()
  @ApiProperty({ name: 'clientId', required: false})
  public client_id?: string;

  @Expose()
  @ApiProperty({ name: 'clientIp', required: false})
  public client_ip?: string;

  @Expose()
  @ApiProperty({ name: 'company', required: false, type: CreatePaymentCompanyDto})
  public company?: CreatePaymentCompanyDto;

  @Expose()
  @ApiProperty({ name: 'country', required: false})
  public country?: string;

  @Expose()
  @ApiProperty({ name: 'createdAt', required: false})
  public created_at?: Date;

  @Expose()
  @ApiProperty({ name: 'currency', required: false})
  public currency?: string;

  @Expose()
  @ApiProperty({ name: 'customerGender', required: false})
  public customer_gender?: string;

  @Expose()
  @ApiProperty({ name: 'customerRedirectUrl', required: false})
  public customer_redirect_url?: string;

  @Expose()
  @ApiProperty({ name: 'customerType', required: false, enum: CustomerTypeEnum})
  public customer_type?: CustomerTypeEnum;

  @Expose()
  @ApiProperty({ name: 'deliveryFee', required: false})
  public delivery_fee?: number;

  @Expose()
  @ApiProperty({ name: 'downPayment', required: false})
  public down_payment?: number;

  @Expose()
  @ApiProperty({ name: 'email', required: false})
  public email?: string;

  @Expose()
  @ApiProperty({ name: 'expiresAt', required: false})
  public expires_at?: Date;

  @Expose()
  @ApiProperty({ name: 'extra', required: false})
  public extra?: any;

  @Expose()
  @ApiProperty({ name: 'failureUrl', required: false})
  public failure_url?: string;

  @Expose()
  @ApiProperty({ name: 'fee', required: false})
  public fee?: number;

  @Expose()
  @ApiProperty({ name: 'firstName', required: false})
  public first_name?: string;

  @Expose()
  @ApiProperty({ name: 'houseExtension', required: false})
  public house_extension?: string;

  @Expose()
  @ApiProperty({ name: 'isDeleted', required: false})
  public is_deleted?: boolean;

  @Expose()
  @ApiProperty({ name: 'isActive', required: false})
  public is_active?: boolean;
  
  @Expose()
  @ApiProperty({ name: 'creator', required: false})
  public creator?: string;
  
  @Expose()
  @ApiProperty({ name: 'lastName', required: false})
  public last_name?: string;

  @Expose()
  @ApiProperty({ name: 'linkMessage', required: false})
  public link_message?: PaymentLinkMessageInterface;

  @Expose()
  @ApiProperty({ name: 'locale', required: false})
  public locale?: string;

  @Expose()
  @ApiProperty({ name: 'noticeUrl', required: false})
  public notice_url?: string;

  @Expose()
  @ApiProperty({ name: 'orderId', required: false})
  public order_id?: string;

  @Expose()
  @ApiProperty({ name: 'orderRef', required: false})
  public order_ref?: string;

  @Expose()
  @ApiProperty({ name: 'organizationName', required: false})
  public organization_name?: string;

  @Expose()
  @ApiProperty({ name: 'originalCart', required: false})
  public original_cart?: any;

  @Expose()
  @ApiProperty({ name: 'paymentData', required: false})
  public payment_data?: any;

  @Expose()
  @ApiProperty({ name: 'paymentIssuer', required: false})
  public payment_issuer?: string;

  @Expose()
  @ApiProperty({ name: 'paymentMethod', required: false, enum: PaymentMethodEnum})
  public payment_method?: PaymentMethodEnum;

  @Expose()
  @ApiProperty({ name: 'pendingUrl', required: false})
  public pending_url?: string;

  @Expose()
  @ApiProperty({ name: 'phone', required: false})
  public phone?: string;

  @Expose()
  @ApiProperty({ name: 'phoneMandatory', required: false})
  public phone_mandatory?: boolean;

  @Expose()
  @ApiProperty({ name: 'pluginVersion', required: false})
  public plugin_version?: string;

  @Expose()
  @ApiProperty({ name: 'privacy', required: false})
  public privacy?: boolean;

  @Expose()
  @ApiProperty({ name: 'purchaseCountry', required: false})
  public purchase_country?: string;

  @Expose()
  @ApiProperty({ name: 'referenceExtra', required: false})
  public reference_extra?: string;

  @Expose()
  @ApiProperty({ name: 'region', required: false})
  public region?: string;

  @Expose()
  @ApiProperty({ name: 'reusable', required: false})
  public reusable?: boolean;

  @Expose()
  @ApiProperty({ name: 'salutation', required: false})
  public salutation?: string;

  @Expose()
  @ApiProperty({ name: 'salutationMandatory', required: false})
  public salutation_mandatory?: boolean;

  @Expose()
  @ApiProperty({ name: 'seller', required: false})
  public seller?: PaymentLinkSellerInterface;

  @Expose()
  @ApiProperty({ name: 'shippingAddress', required: false})
  public shipping_address?: PaymentLinkAddressInterface;

  @Expose()
  @ApiProperty({ name: 'shippingOption', required: false, type: CreatePaymentShippingOptionDto, isArray: true})
  public shipping_option?: CreatePaymentShippingOptionDto;

  @Expose()
  @ApiProperty({ name: 'skipHandlePaymentFee', required: false})
  public skip_handle_payment_fee?: boolean;

  @Expose()
  @ApiProperty({ name: 'socialSecurityNumber', required: false})
  public social_security_number?: string;

  @Expose()
  @ApiProperty({ name: 'splits', required: false, type: CreatePaymentSplitDto, isArray: true})
  public splits?: CreatePaymentSplitDto[];

  @Expose()
  @ApiProperty({ name: 'street', required: false})
  public street?: string;

  @Expose()
  @ApiProperty({ name: 'streetName', required: false})
  public street_name?: string;

  @Expose()
  @ApiProperty({ name: 'streetNumber', required: false})
  public street_number?: string;

  @Expose()
  @ApiProperty({ name: 'successUrl', required: false})
  public success_url?: string;

  @Expose()
  @ApiProperty({ name: 'testMode', required: false})
  public test_mode?: boolean;

  @Expose()
  @ApiProperty({ name: 'useDefaultVariant', required: false})
  public use_default_variant?: boolean;

  @Expose()
  @ApiProperty({ name: 'useIframe', required: false})
  public use_iframe?: boolean;

  @Expose()
  @ApiProperty({ name: 'useInventory', required: false})
  public use_inventory?: boolean;

  @Expose()
  @ApiProperty({ name: 'useStyles', required: false})
  public use_styles?: boolean;

  @Expose()
  @ApiProperty({ name: 'variantId', required: false})
  public variant_id?: string;

  @Expose()
  @ApiProperty({ name: 'verifyTwoFactor', required: false, enum: TwoFactorTypeEnum})
  public verify_two_factor?: TwoFactorTypeEnum;

  @Expose()
  @ApiProperty({ name: 'verifyType', required: false, enum: VerifyTypeEnum})
  public verify_type?: VerifyTypeEnum;

  @Expose()
  @ApiProperty({ name: 'xFrameHost', required: false})
  public x_frame_host?: string;

  @Expose()
  @ApiProperty({ name: 'zip', required: false})
  public zip?: string;

  @Expose()
  @ApiProperty({ name: 'transactionsCount', required: false})
  public transactions_count?: number;

  @Expose()
  @ApiProperty({ name: 'viewsCount', required: false})
  public views_count?: number;
}
