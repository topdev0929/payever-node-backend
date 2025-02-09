import { Exclude, Expose, Type } from 'class-transformer';
import { NotificationMessagePaymentDto } from './notification-message-payment.dto';
import { NotificationMessageActionDto } from './notification-message-action.dto';
import { PaymentNotificationErrorDto } from './payment-notification-error.dto';

@Exclude()
export class NotificationMessageDataDto {
  @Type(() => NotificationMessagePaymentDto)
  @Expose()
  public payment: NotificationMessagePaymentDto;

  @Type(() => NotificationMessageActionDto)
  @Expose()
  public action?: NotificationMessageActionDto;

  @Type(() => PaymentNotificationErrorDto)
  @Expose()
  public error?: PaymentNotificationErrorDto;

  @Expose()
  public event_source?: string;

}
