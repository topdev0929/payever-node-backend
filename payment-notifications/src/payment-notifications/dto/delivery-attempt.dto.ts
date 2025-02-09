import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PaymentNotificationStatusesEnum } from '../enums';
import { DeliveryAttemptInterface } from '../interfaces';

@Exclude()
export class DeliveryAttemptDto implements DeliveryAttemptInterface {
  @IsString()
  @Expose()
  public exceptionMessage?: string;

  @IsString()
  @Expose()
  public notificationId: string;

  @IsString()
  @Expose()
  public responseMessage?: string;

  @IsNumber()
  @Expose()
  public responseStatusCode?: number;

  @IsString()
  @Expose()
  public status: PaymentNotificationStatusesEnum;
}
