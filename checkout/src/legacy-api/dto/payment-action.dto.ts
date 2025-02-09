import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';
import { PaymentAddressDto } from './response/payment-address.dto';
import { PaymentInterface } from '../interfaces';
@Exclude()
export class PaymentActionDto implements PaymentInterface {
  @IsString()
  @Expose()
  public readonly original_id: string;

  @IsString()
  @Expose()
  public readonly uuid: string;

  @IsString()
  @Expose()
  public readonly status: string;

  @IsString()
  @Expose()
  public readonly specific_status: string;

  @IsString()
  @Expose()
  public readonly color_state: string;

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
  @Expose({ name: 'type' })
  public readonly payment_type: string;
  
  @IsEmail()
  @Expose()
  public readonly customer_email: string;

  @IsDateString()
  @Expose()
  public readonly created_at: string;

  @IsDateString()
  @Expose()
  public readonly updated_at: string;

  @IsString()
  @Expose()
  public readonly channel: string;

  @IsString()
  @Expose()
  public readonly channel_set_id?: string;

  @IsString()
  @Expose()
  public readonly channel_source?: string;

  @IsString()
  @Expose()
  public readonly channel_type?: string;

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

  @IsString()
  @Expose()
  public readonly shipping_category?: string;

  @IsString()
  @Expose()
  public readonly shipping_method_name?: string;

  @IsString()
  @Expose()
  public readonly shipping_option_name?: string;

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

  @Type(() => PaymentAddressDto)
  @Expose()
  public readonly billing_address: PaymentAddressDto;

  @Type(() => PaymentAddressDto)
  @Expose()
  public readonly shipping_address?: PaymentAddressDto;

  @IsString()
  @Expose()
  public readonly business_option_id: string;

  @IsString()
  @Expose()
  public readonly business_uuid?: string;

  @IsString()
  @Expose()
  public readonly channel_set_uuid?: string;
}
