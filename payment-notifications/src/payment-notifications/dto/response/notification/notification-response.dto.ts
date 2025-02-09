import { PaymentNotificationStatusesEnum } from '../../../enums';
import { Expose, Exclude, Type } from 'class-transformer';
import { DeliveryAttemptResponseDto } from './delivery-attempt-response.dto';


@Exclude()
export class NotificationResponseDto {

  @Expose({ name: 'apiCallId' })
  public eventId: string;


  @Expose({ name: 'createdAt' })
  public timestamp?: Date;

  @Expose()
  @Type(() => DeliveryAttemptResponseDto)
  public deliveryAttempts?: DeliveryAttemptResponseDto[];


  @Expose({ name: 'notificationType' })
  public eventType: string;

  @Expose()
  public paymentId: string;

  @Expose()
  public status: PaymentNotificationStatusesEnum;


}
