import { PaymentNotificationStatusesEnum } from '../../../enums';
import { Expose, Exclude, Type } from 'class-transformer';


@Exclude()
export class DeliveryAttemptResponseDto {
  @Expose()
  public createdAt?: Date;

  @Expose()
  public exceptionMessage?: string;

  @Expose()
  public notificationId: string;

  @Expose()
  public responseMessage?: string;

  @Expose()
  public responseStatusCode?: number;

  @Expose()
  public status: PaymentNotificationStatusesEnum;

}
