import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentAddressDto } from './create-payment-address.dto';
import { CreatePaymentBusinessDto } from './create-payment-business.dto';
import { CreatePaymentChannelSetDto } from './create-payment-channel-set.dto';
import { CreatePaymentFlowDto } from './create-payment-flow.dto';
import { CreatePaymentShippingOptionDto } from './create-payment-shipping-option.dto';
import { CreatePaymentItemDto } from './create-payment-item.dto';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @IsString()
  public status: string;

  @IsNotEmpty()
  @IsString()
  public specific_status: string;

  @IsOptional()
  @IsString()
  public color_state: string;

  @IsOptional()
  @IsString()
  public customer_name: string;

  @IsOptional()
  @IsString()
  public customer_type?: string;

  @IsOptional()
  @IsString()
  public payment_issuer?: string;

  @IsNotEmpty()
  @IsString()
  public payment_type: string;

  @IsNotEmpty()
  @IsEmail()
  public customer_email: string;

  @IsNotEmpty()
  @IsDateString()
  public created_at: Date;

  @IsNotEmpty()
  @IsDateString()
  public updated_at: Date;

  @IsNotEmpty()
  @IsString()
  public channel: string;

  @IsOptional()
  @IsString()
  public channel_set_id?: string;

  @IsOptional()
  @IsString()
  public channel_source?: string;

  @IsOptional()
  @IsString()
  public channel_type?: string;

  @IsNotEmpty()
  @IsString()
  public reference: string;

  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsNumber()
  public total: number;

  @IsNotEmpty()
  @IsString()
  public currency: string;

  @IsString()
  public shipping_category?: string;

  @IsString()
  public shipping_method_name?: string;

  @IsString()
  public shipping_option_name?: string;

  @IsNotEmpty()
  @IsNumber()
  public delivery_fee: number;

  @IsNotEmpty()
  @IsNumber()
  public payment_fee: number;

  @IsNotEmpty()
  @IsNumber()
  public down_payment: number;

  @IsOptional()
  @IsString()
  public business_option_id: string;

  @IsArray()
  public payment_details?: [];

  @IsNotEmpty()
  @ValidateNested()
  public business: CreatePaymentBusinessDto;

  @IsNotEmpty()
  @ValidateNested()
  public channel_set: CreatePaymentChannelSetDto;

  @IsNotEmpty()
  @ValidateNested()
  public address: CreatePaymentAddressDto;

  @ValidateNested()
  public shipping_address?: CreatePaymentAddressDto;

  @IsOptional()
  @IsString()
  public api_call_id?: string;

  @IsNotEmpty()
  @ValidateNested()
  public payment_flow: CreatePaymentFlowDto;

  @IsOptional()
  @ValidateNested()
  public shipping_option: CreatePaymentShippingOptionDto;

  @IsOptional()
  @Type(() => CreatePaymentItemDto)
  @ValidateNested({ each: true})
  public items: CreatePaymentItemDto[];
}
