import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsDateString, IsString, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatusesEnum } from '@pe/payments-sdk';
import { NotificationMessageAddressDto } from './notification-message-address.dto';
import { NotificationMessageItemDto } from './notification-message-item.dto';

@Exclude()
export class NotificationMessagePaymentDto {
  @IsString()
  @Expose()
  public id: string;

  @IsNumber()
  @Expose()
  public amount: number;

  @Type(() => NotificationMessageAddressDto)
  @Expose()
  public address: NotificationMessageAddressDto;

  @IsString()
  @Expose()
  public channel: string;

  @IsDateString()
  @Expose()
  public created_at: Date;

  @IsString()
  @Expose()
  public currency: string;

  @IsString()
  @Expose()
  public customer_email: string;

  @IsString()
  @Expose()
  public customer_name: string;

  @IsString()
  @Expose()
  public delivery_fee: number;

  @IsString()
  @Expose()
  public down_payment?: number;

  @IsString()
  @Expose()
  public merchant_name: string;

  @Expose()
  public payment_details?: { };

  @Expose()
  @Transform((value: any, obj: NotificationMessagePaymentDto) => obj.payment_details)
  public payment_details_array?: { };

  @IsString()
  @Expose()
  public payment_fee: number;

  @IsString()
  @Expose()
  public payment_type: string;

  @IsString()
  @Expose()
  public reference: string;

  @Type(() => NotificationMessageAddressDto)
  @Expose()
  public shipping_address?: NotificationMessageAddressDto;

  @IsString()
  @Expose()
  public specific_status?: string;

  @IsString()
  @Expose()
  public status: PaymentStatusesEnum;

  @IsNumber()
  @Expose()
  public total: number;

  @IsDateString()
  @Expose()
  public updated_at: Date;

  @Type(() => NotificationMessageItemDto)
  @Expose()
  public captured_items?: NotificationMessageItemDto[];

  @Type(() => NotificationMessageItemDto)
  @Expose()
  public refunded_items?: NotificationMessageItemDto[];

  @Expose()
  @Type(() => NotificationMessageItemDto)
  public canceled_items?: NotificationMessageItemDto[];

  @Expose()
  public total_captured_amount?: number;

  @Expose()
  public total_refunded_amount?: number;

  @Expose()
  public total_canceled_amount?: number;

  @IsNumber()
  @Expose()
  public capture_amount?: number;

  @IsNumber()
  @Expose()
  public refund_amount?: number;

  @IsNumber()
  @Expose()
  public cancel_amount?: number;
}
