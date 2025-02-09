import { PaymentNotificationStatusesEnum } from '../enums';

export interface DeliveryAttemptInterface {
  createdAt?: Date;
  exceptionMessage?: string;
  notificationId: string;
  responseMessage?: string;
  responseStatusCode?: number;
  status: PaymentNotificationStatusesEnum;
}
