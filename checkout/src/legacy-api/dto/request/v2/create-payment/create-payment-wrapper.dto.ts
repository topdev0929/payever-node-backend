import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { CreatePaymentChannelDto } from './create-payment-channel.dto';
import { CreatePaymentItemDto } from './create-payment-item.dto';
import { CreatePaymentVerifyDto } from './create-payment-verify.dto';
import { TwoFactorTypeEnum, PaymentMethodEnum } from '../../../../enum';
import { CreatePaymentSellerDto } from './create-payment-seller.dto';
import { CreatePaymentLinkMessageDto } from './create-payment-link-message.dto';
import { CreatePaymentAddressDto } from './create-payment-address.dto';

export class CreatePaymentWrapperDto {
  @ApiProperty( { type: [CreatePaymentItemDto]})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentItemDto)
  @ValidateNested({ groups: ['create', 'submit', 'link'], each: true})
  public cart: CreatePaymentItemDto[];

  @ApiProperty()
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => CreatePaymentChannelDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public channel: CreatePaymentChannelDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentVerifyDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public verify?: CreatePaymentVerifyDto;

  @ApiProperty()
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  @Type(() => CreatePaymentAddressDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public billing_address?: CreatePaymentAddressDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentAddressDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public shipping_address?: CreatePaymentAddressDto;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => String)
  public order_id: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Max(99999999.99, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  @Type(() => Number)
  public amount: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => Number)
  public fee?: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => Number)
  public down_payment?: number;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public currency: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  @IsEnum(PaymentMethodEnum, { groups: ['create', 'submit', 'link']})
  @ValidateIf((o: CreatePaymentWrapperDto) => !!o.payment_method, { groups: ['create']})
  public payment_method?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public birthdate?: Date;

  @ApiProperty()
  @IsString({ groups: ['two_factor_sms', 'create']})
  @IsOptional()
  @IsNotEmpty({ groups: ['two_factor_sms']})
  @ValidateIf(
    (o: CreatePaymentWrapperDto) => !!o.phone || o.verify?.two_factor === TwoFactorTypeEnum.sms,
    { groups: ['create']},
  )
  public phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ groups: ['two_factor_email', 'submit']})
  @ValidateIf(
    (o: CreatePaymentWrapperDto) => !!o.email || o.verify?.two_factor === TwoFactorTypeEnum.email,
    { groups: ['create']},
  )
  @IsEmail({ }, { groups: ['two_factor_email', 'create', 'submit']})
  public email?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public success_url?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public pending_url?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public failure_url?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public cancel_url?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public notice_url?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsUrl({ }, { groups: ['create', 'submit', 'link']})
  public customer_redirect_url?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public x_frame_host?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public variant_id?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_cart_step?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public use_inventory?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public expires_at?: Date;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public extra?: any;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public locale?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public plugin_version?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentSellerDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public seller?: CreatePaymentSellerDto;

  @ApiProperty()
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public payment_data?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public reusable?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  @Type(() => CreatePaymentLinkMessageDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public link_message?: CreatePaymentLinkMessageDto;

  @ApiProperty()
  @IsString({ groups: ['client_ip_required']})
  @IsNotEmpty({ groups: ['client_ip_required'] })
  @IsOptional({ groups: ['link']})
  public client_ip?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public client_id?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public log_level?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public privacy?: boolean;
}
