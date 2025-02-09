import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaymentFlowAddressDto } from './payment-flow-address.dto';

export class PaymentFlowDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsNumber()
  public amount: number;

  @IsNumber()
  public down_payment: number;

  @IsString()
  public api_call_create_id: string;

  @IsString()
  public business_payment_option_uuid: string;

  @IsString()
  public payment_method?: string;

  @IsString()
  public business_id: string;

  @IsNumber()
  public shipping_fee: number;

  @IsString()
  @IsOptional()
  public currency?: string;

  @IsString()
  @IsOptional()
  public reference?: string;

  @IsString()
  @IsOptional()
  public channel_set_uuid?: string;

  @IsString()
  @IsOptional()
  public state?: string;

  @IsOptional()
  @IsString()
  public origin?: string;

  @IsOptional()
  @IsString()
  public plugin_version?: string;

  @IsOptional()
  @IsString()
  public seller_email?: string;

  @IsOptional()
  @Type(() => PaymentFlowAddressDto)
  public billing_address?: PaymentFlowAddressDto;

  @IsOptional()
  @Type(() => PaymentFlowAddressDto)
  public shipping_address?: PaymentFlowAddressDto;
}
