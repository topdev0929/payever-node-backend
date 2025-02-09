import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested, IsEnum } from 'class-validator';
import {
  CreatePaymentChannelDto,
  CreatePaymentSellerDto,
  CreatePaymentVerifyDto,
  CreatePaymentLinkMessageDto,
} from '../../v2';
import { CreatePaymentPurchaseDto } from './create-payment-purchase.dto';
import { CreatePaymentCustomerDto } from './create-payment-customer.dto';
import { CreatePaymentCompanyDto } from './create-payment-company.dto';
import { CreatePaymentAddressDto } from './create-payment-address.dto';
import { PaymentMethodEnum, PaymentIssuerEnum } from '../../../../enum';
import { CreatePaymentShippingOptionDto } from './create-payment-shipping-option.dto';
import { CreatePaymentItemDto } from './create-payment-item.dto';
import { CreatePaymentSplitDto } from './create-payment-split.dto';
import { CreatePaymentUrlsDto } from './create-payment-urls.dto';
import { CreatePaymentOptionsDto } from './create-payment-options.dto';
import { CreatePaymentDeviceDto } from './create-payment-device.dto';
import { CustomerTypeEnum } from '../../../../../common/enum';

export class CreatePaymentWrapperDto {
  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentChannelDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public channel: CreatePaymentChannelDto;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public locale?: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  @IsEnum(PaymentIssuerEnum, { groups: ['create', 'submit', 'link']})
  public payment_issuer?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  @IsEnum(PaymentMethodEnum, { groups: ['create', 'submit', 'link']})
  @ValidateIf((o: CreatePaymentWrapperDto) => !!o.payment_method, { groups: ['create']})
  public payment_method?: string;

  @ApiProperty()
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public payment_data?: any;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link', 'has_order']})
  @Type(() => String)
  public reference: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => String)
  public reference_extra: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => String)
  public order_id: string;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentPurchaseDto)
  @ValidateNested({ groups: ['create', 'submit', 'link', 'has_order']})
  public purchase?: CreatePaymentPurchaseDto;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'submit', 'two_factor_sms', 'two_factor_email']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentCustomerDto)
  @ValidateNested({ groups: ['create', 'submit', 'link', 'two_factor_sms', 'two_factor_email', 'has_order']})
  public customer?: CreatePaymentCustomerDto;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentCompanyDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  @ValidateIf(
    (o: CreatePaymentWrapperDto) => !!o.customer && o.customer?.type === CustomerTypeEnum.organization,
    { groups: ['create', 'submit']},
  )
  public company?: CreatePaymentCompanyDto;

  @ApiProperty()
  @IsOptional({ groups: ['create', 'link', 'has_order']})
  @IsNotEmpty({ groups: ['submit']})
  @Type(() => CreatePaymentAddressDto)
  @ValidateNested({ groups: ['create', 'submit', 'link', 'has_order']})
  public billing_address?: CreatePaymentAddressDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link', 'has_order']})
  @Type(() => CreatePaymentAddressDto)
  @ValidateNested({ groups: ['create', 'submit', 'link', 'has_order']})
  public shipping_address?: CreatePaymentAddressDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentShippingOptionDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public shipping_option?: CreatePaymentShippingOptionDto;

  @ApiProperty({ type: CreatePaymentItemDto, isArray: true})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link', 'has_order']})
  @Type(() => CreatePaymentItemDto)
  @ValidateNested({ groups: ['create', 'submit', 'link', 'has_order'], each: true})
  public cart: CreatePaymentItemDto[];

  @ApiProperty({ type: CreatePaymentSplitDto, isArray: true})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentSplitDto)
  @ValidateNested({ groups: ['create', 'submit', 'link'], each: true})
  public splits: CreatePaymentSplitDto[];

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentUrlsDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public urls?: CreatePaymentUrlsDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentVerifyDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public verify?: CreatePaymentVerifyDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentSellerDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public seller?: CreatePaymentSellerDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentOptionsDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public options?: CreatePaymentOptionsDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentDeviceDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public device?: CreatePaymentDeviceDto;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public plugin_version?: string;

  @ApiProperty()
  @IsString({ groups: ['client_ip_required']})
  @IsNotEmpty({ groups: ['client_ip_required'] })
  @IsOptional({ groups: ['link']})
  public client_ip?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public x_frame_host?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public expires_at?: Date;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public variant_id?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public extra?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public log_level?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public privacy?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  @Type(() => CreatePaymentLinkMessageDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public link_message?: CreatePaymentLinkMessageDto;
}
