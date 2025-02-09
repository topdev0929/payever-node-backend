import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PaymentNotificationStatusesEnum } from '../enums';
import { NotificationInterface } from '../interfaces';

@Exclude()
export class NotificationDto implements NotificationInterface {
  @IsString()
  @Expose()
  public apiCallId: string;

  @IsString()
  @Expose()
  public businessId: string;

  @IsDateString()
  @Expose()
  public deliveryAt?: Date;

  @IsString()
  @Expose()
  public message: string;

  @IsString()
  @Expose()
  public notificationType: string;

  @IsString()
  @Expose()
  public paymentId: string;

  @IsNumber()
  @Expose()
  public retriesNumber?: number;

  @IsString()
  @Expose()
  public status: PaymentNotificationStatusesEnum;

  @IsString()
  @Expose()
  public url: string;
}
