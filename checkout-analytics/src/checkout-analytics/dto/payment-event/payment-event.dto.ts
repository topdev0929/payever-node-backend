import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentEventAddressDto } from './payment-event-address.dto';
import { PaymentEventBusinessDto } from './payment-event-business.dto';
import { PaymentEventChannelSetDto } from './payment-event-channel-set.dto';
import { PaymentEventItemDto } from './payment-event-item.dto';
import { PaymentFlowEventDto } from '../payment-flow-event';

export class PaymentEventDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsNumber()
  public delivery_fee: number;

  @IsNotEmpty()
  @IsNumber()
  public down_payment: number;

  @IsNotEmpty()
  @IsNumber()
  public total: number;

  @IsOptional()
  @IsString()
  public user_uuid: string;

  @IsNotEmpty()
  @ValidateNested()
  public business: PaymentEventBusinessDto;

  @IsNotEmpty()
  @IsString()
  public channel: string;

  @IsNotEmpty()
  @ValidateNested()
  public channel_set: PaymentEventChannelSetDto;

  @IsNotEmpty()
  @IsString()
  public currency: string;

  @IsOptional()
  public payment_flow: PaymentFlowEventDto;

  @IsOptional()
  @IsString()
  public customer_name: string;

  @IsOptional()
  @IsString()
  public customer_type?: string;

  @IsNotEmpty()
  @IsString()
  public payment_type: string;

  @IsOptional()
  @IsEmail()
  public customer_email: string;

  @IsNotEmpty()
  @IsString()
  public reference: string;

  @IsNotEmpty()
  @IsString()
  public specific_status: string;

  @IsNotEmpty()
  @IsString()
  public status: string;

  @IsNotEmpty()
  @ValidateNested()
  public address: PaymentEventAddressDto;

  @ValidateNested()
  public shipping_address?: PaymentEventAddressDto;

  @ValidateNested()
  public items: PaymentEventItemDto[];

  @IsNotEmpty()
  @IsDateString()
  public created_at: Date;

  @IsNotEmpty()
  @IsDateString()
  public updated_at: Date;

  @IsOptional()
  @IsString()
  public api_call_id?: string;

  @IsOptional()
  @IsBoolean()
  public force_redirect?: boolean;
}
