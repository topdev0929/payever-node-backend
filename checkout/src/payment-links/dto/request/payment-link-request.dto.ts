import { PaymentLinkInterface } from '../../interfaces';
import { ApiCallCartItemInterface } from '../../../common/interfaces';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsEnum, IsNumber, IsDate } from 'class-validator';
import {
  VerifyTypeEnum,
  TwoFactorTypeEnum,
  PaymentMethodEnum,
} from '../../../legacy-api/enum';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentLinkAddressDto } from './payment-link-address.dto';
import { PaymentLinkCompanyDto } from './payment-link-company.dto';
import { PaymentLinkMessageDto } from './payment-link-message.dto';
import { PaymentLinkShippingOptionDto } from './payment-link-shipping-option.dto';
import { PaymentLinkSellerDto } from './payment-link-seller.dto';
import { PaymentLinkSplitDto } from './payment-link-split.dto';
import { CustomerTypeEnum } from '../../../common/enum';

@Exclude()
export class PaymentLinkRequestDto implements PaymentLinkInterface {
  @Expose( { name: 'expiresAt'})
  @ApiProperty({ required: false, name: 'expiresAt'})
  @IsOptional()
  @IsDate()
  @Transform((value: string) => {
    if (value) {
      return new Date(value);
    } else {
      return null;
    }
  }, { toClassOnly: true })
  public expires_at?: Date;

  @Expose( { name: 'isActive'})
  @ApiProperty({ required: false, name: 'isActive'})
  @IsOptional()
  @IsBoolean()
  public is_active?: boolean;

  @Expose( { name: 'creator'})
  @ApiProperty({ required: false, name: 'creator'})
  @IsOptional()
  @IsString()
  public creator?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsBoolean()
  public reusable: boolean;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public currency?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsNumber()
  public amount?: number;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public reference?: string;

  @Expose( { name: 'deliveryFee'})
  @ApiProperty({ required: false, name: 'deliveryFee'})
  @IsOptional()
  @IsNumber()
  public delivery_fee?: number;

  @Expose( { name: 'downPayment'})
  @ApiProperty({ required: false, name: 'downPayment'})
  @IsOptional()
  @IsNumber()
  public down_payment?: number;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsNumber()
  public fee?: number;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public locale?: string;

  @Expose( { name: 'allowBillingStep'})
  @ApiProperty({ required: false, name: 'allowBillingStep'})
  @IsOptional()
  @IsBoolean()
  public allow_billing_step?: boolean;

  @Expose( { name: 'allowCartStep'})
  @ApiProperty({ required: false, name: 'allowCartStep'})
  @IsOptional()
  @IsBoolean()
  public allow_cart_step?: boolean;

  @Expose( { name: 'allowCustomerTypes'})
  @ApiProperty({ required: false, enum: CustomerTypeEnum, isArray: true, name: 'allowCustomerTypes'})
  @IsOptional()
  @IsEnum(CustomerTypeEnum, { each: true})
  public allow_customer_types?: CustomerTypeEnum[];

  @Expose( { name: 'allowPaymentMethods'})
  @ApiProperty({ required: false, enum: PaymentMethodEnum, isArray: true, name: 'allowPaymentMethods'})
  @IsOptional()
  @IsEnum( PaymentMethodEnum, { each: true})
  public allow_payment_methods?: PaymentMethodEnum[];

  @Expose( { name: 'allowSeparateShippingAddress'})
  @ApiProperty({ required: false, name: 'allowSeparateShippingAddress'})
  @IsOptional()
  @IsBoolean()
  public allow_separate_shipping_address?: boolean;

  @Expose( { name: 'allowShippingStep'})
  @ApiProperty({ required: false, name: 'allowShippingStep'})
  @IsOptional()
  @IsBoolean()
  public allow_shipping_step?: boolean;

  @Expose( { name: 'birthdateMandatory'})
  @ApiProperty({ required: false, name: 'birthdateMandatory'})
  @IsOptional()
  @IsBoolean()
  public birthdate_mandatory?: boolean;

  @Expose( { name: 'salutationMandatory'})
  @ApiProperty({ required: false, name: 'salutationMandatory'})
  @IsOptional()
  @IsBoolean()
  public salutation_mandatory?: boolean;

  @Expose( { name: 'phoneMandatory'})
  @ApiProperty({ required: false, name: 'phoneMandatory'})
  @IsOptional()
  @IsBoolean()
  public phone_mandatory?: boolean;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  public cart?: ApiCallCartItemInterface[];

  @Expose( { name: 'apiVersion'})
  @ApiProperty({ required: false, name: 'apiVersion'})
  @IsOptional()
  @IsString()
  public api_version?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public salutation?: string;

  @Expose( { name: 'firstName'})
  @ApiProperty({ required: false, name: 'firstName'})
  @IsOptional()
  @IsString()
  public first_name?: string;

  @Expose( { name: 'lastName'})
  @ApiProperty({ required: false, name: 'lastName'})
  @IsOptional()
  @IsString()
  public last_name?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public zip?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public country?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public region?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public city?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public street?: string;

  @Expose( { name: 'streetName'})
  @ApiProperty({ required: false, name: 'streetName'})
  @IsOptional()
  @IsString()
  public street_name?: string;

  @Expose( { name: 'streetNumber'})
  @ApiProperty({ required: false, name: 'streetNumber'})
  @IsOptional()
  @IsString()
  public street_number?: string;

  @Expose( { name: 'organizationName'})
  @ApiProperty({ required: false, name: 'organizationName'})
  @IsOptional()
  @IsString()
  public organization_name?: string;

  @Expose( { name: 'addressLine2'})
  @ApiProperty({ required: false, name: 'addressLine2'})
  @IsOptional()
  @IsString()
  public address_line_2?: string;

  @Expose( { name: 'houseExtension'})
  @ApiProperty({ required: false, name: 'houseExtension'})
  @IsOptional()
  @IsString()
  public house_extension?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public email?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public phone?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsDate()
  @Transform((value: string) => {
    if (value) {
      return new Date(value);
    }
  }, { toClassOnly: true })
  public birthdate?: Date;

  @Expose( { name: 'shippingAddress'})
  @ApiProperty({ required: false, name: 'shippingAddress'})
  @IsOptional()
  @Type( () => PaymentLinkAddressDto)
  public shipping_address?: PaymentLinkAddressDto;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public channel?: string;

  @Expose( { name: 'channelSetId'})
  @ApiProperty({ required: false, name: 'channelSetId'})
  @IsOptional()
  @IsString()
  public channel_set_id?: number;

  @Expose( { name: 'channelSource'})
  @ApiProperty({ required: false, name: 'channelSource'})
  @IsOptional()
  @IsString()
  public channel_source?: string;

  @Expose( { name: 'channelType'})
  @ApiProperty({ required: false, name: 'channelType'})
  @IsOptional()
  @IsString()
  public channel_type?: string;

  @Expose( { name: 'clientId'})
  @ApiProperty({ required: false, name: 'clientId'})
  @IsOptional()
  @IsString()
  public client_id?: string;

  @Expose( { name: 'clientIp'})
  @ApiProperty({ required: false, name: 'clientIp'})
  @IsOptional()
  @IsString()
  public client_ip?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkCompanyDto)
  public company?: PaymentLinkCompanyDto;

  @Expose( { name: 'customerType'})
  @ApiProperty({ required: false, enum: CustomerTypeEnum, name: 'customerType'})
  @IsOptional()
  @IsEnum(CustomerTypeEnum)
  public customer_type?: CustomerTypeEnum;

  @Expose( { name: 'customerGender'})
  @ApiProperty({ required: false, name: 'customerGender'})
  @IsOptional()
  @IsString()
  public customer_gender?: string;

  @Expose( { name: 'noticeUrl'})
  @ApiProperty({ required: false, name: 'noticeUrl'})
  @IsOptional()
  @IsString()
  public notice_url?: string;

  @Expose( { name: 'cancelUrl'})
  @ApiProperty({ required: false, name: 'cancelUrl'})
  @IsOptional()
  @IsString()
  public cancel_url?: string;

  @Expose( { name: 'failureUrl'})
  @ApiProperty({ required: false, name: 'failureUrl'})
  @IsOptional()
  @IsString()
  public failure_url?: string;

  @Expose( { name: 'pendingUrl'})
  @ApiProperty({ required: false, name: 'pendingUrl'})
  @IsOptional()
  @IsString()
  public pending_url?: string;

  @Expose( { name: 'successUrl'})
  @ApiProperty({ required: false, name: 'successUrl'})
  @IsOptional()
  @IsString()
  public success_url?: string;

  @Expose( { name: 'customerRedirectUrl'})
  @ApiProperty({ required: false, name: 'customerRedirectUrl'})
  @IsOptional()
  @IsString()
  public customer_redirect_url?: string;

  @Expose( { name: 'paymentMethod'})
  @ApiProperty({ required: false, name: 'paymentMethod'})
  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  public payment_method?: PaymentMethodEnum;

  @Expose( { name: 'paymentData'})
  @ApiProperty({ required: false, name: 'paymentData'})
  @IsOptional()
  public payment_data?: any;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  public extra?: any;

  @Expose( { name: 'linkMessage'})
  @ApiProperty({ required: false, name: 'linkMessage'})
  @IsOptional()
  @Type( () => PaymentLinkMessageDto)
  public link_message?: PaymentLinkMessageDto;

  @Expose( { name: 'orderId'})
  @ApiProperty({ required: false, name: 'orderId'})
  @IsOptional()
  @IsString()
  public order_id?: string;

  @Expose( { name: 'orderRef'})
  @ApiProperty({ required: false, name: 'orderRef'})
  @IsOptional()
  @IsString()
  public order_ref?: string;

  @Expose( { name: 'originalCart'})
  @ApiProperty({ required: false, name: 'originalCart'})
  @IsOptional()
  public original_cart?: any;

  @Expose( { name: 'paymentIssuer'})
  @ApiProperty({ required: false, name: 'paymentIssuer'})
  @IsOptional()
  @IsString()
  public payment_issuer?: string;

  @Expose( { name: 'pluginVersion'})
  @ApiProperty({ required: false, name: 'pluginVersion'})
  @IsOptional()
  @IsString()
  public plugin_version?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsBoolean()
  public privacy?: boolean;

  @Expose( { name: 'purchaseCountry'})
  @ApiProperty({ required: false, name: 'purchaseCountry'})
  @IsOptional()
  @IsString()
  public purchase_country?: string;

  @Expose( { name: 'referenceExtra'})
  @ApiProperty({ required: false, name: 'referenceExtra'})
  @IsOptional()
  @IsString()
  public reference_extra?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkSellerDto )
  public seller?: PaymentLinkSellerDto;

  @Expose( { name: 'shippingOption'})
  @ApiProperty({ required: false, name: 'shippingOption'})
  @IsOptional()
  @Type( () => PaymentLinkShippingOptionDto)
  public shipping_option?: PaymentLinkShippingOptionDto;

  @Expose( { name: 'skipHandlePaymentFee'})
  @ApiProperty({ required: false, name: 'skipHandlePaymentFee'})
  @IsOptional()
  @IsBoolean()
  public skip_handle_payment_fee?: boolean;

  @Expose( { name: 'socialSecurityNumber'})
  @ApiProperty({ required: false, name: 'socialSecurityNumber'})
  @IsOptional()
  @IsString()
  public social_security_number?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkSplitDto)
  public splits: PaymentLinkSplitDto[];

  @Expose( { name: 'verifyTwoFactor'})
  @ApiProperty({ required: false, enum: TwoFactorTypeEnum, name: 'verifyTwoFactor'})
  @IsOptional()
  @IsEnum(TwoFactorTypeEnum)
  public verify_two_factor?: TwoFactorTypeEnum;

  @Expose( { name: 'verifyType'})
  @ApiProperty({ required: false, enum: VerifyTypeEnum, name: 'verifyType'})
  @IsOptional()
  @IsEnum(VerifyTypeEnum)
  public verify_type?: VerifyTypeEnum;

  @Expose( { name: 'testMode'})
  @ApiProperty({ required: false, name: 'testMode'})
  @IsOptional()
  @IsBoolean()
  public test_mode?: boolean;

  @Expose( { name: 'useDefaultVariant'})
  @ApiProperty({ required: false, name: 'useDefaultVariant'})
  @IsOptional()
  @IsBoolean()
  public use_default_variant?: boolean;

  @Expose( { name: 'useIframe'})
  @ApiProperty({ required: false, name: 'useIframe'})
  @IsOptional()
  @IsBoolean()
  public use_iframe?: boolean;

  @Expose( { name: 'useInventory'})
  @ApiProperty({ required: false, name: 'useInventory'})
  @IsOptional()
  @IsBoolean()
  public use_inventory?: boolean;

  @Expose( { name: 'useStyles'})
  @ApiProperty({ required: false, name: 'useStyles'})
  @IsOptional()
  @IsBoolean()
  public use_styles?: boolean;

  @Expose( { name: 'variantId'})
  @ApiProperty({ required: false, name: 'variantId'})
  @IsOptional()
  @IsString()
  public variant_id?: string;

  @Expose( { name: 'xFrameHost'})
  @ApiProperty({ required: false, name: 'xFrameHost'})
  @IsOptional()
  @IsString()
  public x_frame_host?: string;

}
