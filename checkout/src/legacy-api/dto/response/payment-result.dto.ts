import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';
import { PaymentAddressDto } from './payment-address.dto';
import { PaymentItemDto } from './payment-item.dto';
import { PaymentShippingOptionDto } from './payment-shipping-option.dto';

@Exclude()
export class PaymentResultDto {
  @IsString()
  @Expose({ name: 'original_id' })
  public readonly id: string;

  @IsString()
  @Expose()
  public readonly status: string;

  @IsString()
  @Expose()
  public readonly specific_status: string;

  @IsString()
  @Expose()
  public readonly merchant_name: string;

  @IsString()
  @Expose()
  public readonly customer_name: string;
  
  @IsString()
  @Expose()
  public readonly payment_issuer?: string;
  
  @IsString()
  @Expose()
  public readonly payment_type: string;
  
  @IsEmail()
  @Expose()
  public readonly customer_email: string;

  @IsDateString()
  @Expose()
  public readonly created_at: string;

  @IsDateString()
  @Expose()
  public readonly updated_at?: string;

  @IsString()
  @Expose()
  public readonly channel: string;

  @IsString()
  @Expose()
  public readonly channel_type: string;

  @IsString()
  @Expose()
  public readonly channel_source: string;

  @IsString()
  @Expose()
  public readonly reference: string;

  @IsNumber()
  @Expose()
  public readonly amount: number;

  @IsNumber()
  @Expose()
  public readonly total: number;

  @IsString()
  @Expose()
  public readonly currency: string;

  @IsNumber()
  @Expose()
  public readonly delivery_fee: number;

  @IsNumber()
  @Expose()
  public readonly payment_fee: number;

  @IsNumber()
  @Expose()
  public readonly down_payment: number;

  @IsArray()
  @Expose()
  public readonly payment_details?: [];

  @IsArray()
  @Expose()
  public history?: any[];

  @IsArray()
  @Expose()
  public payment_details_array?: [];

  @Type(() => PaymentAddressDto)
  @Expose({ name: 'billing_address' })
  public address: PaymentAddressDto;

  @Type(() => PaymentAddressDto)
  @Expose()
  public shipping_address?: PaymentAddressDto;


  @IsArray()
  @Type(() => PaymentItemDto)
  @Expose()
  public items?: PaymentItemDto[];

  @Expose()
  @Type(() => PaymentShippingOptionDto)
  public shipping_option?: PaymentShippingOptionDto;

  public setPaymentDetailsArray(payment_details?: []): void {
    this.payment_details_array = payment_details;
  }
}
