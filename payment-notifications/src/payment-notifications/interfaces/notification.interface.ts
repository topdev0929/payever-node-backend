import { PaymentNotificationStatusesEnum } from '../enums';
import { DeliveryAttemptInterface } from './delivery-attempt.interface';

export interface NotificationInterface {
  apiCallId: string;
  businessId: string;
  deliveryAt?: Date;
  deliveryAttempts?: DeliveryAttemptInterface[];
  message: string;
  notificationType: string;
  paymentId: string;
  retriesNumber?: number;
  status: PaymentNotificationStatusesEnum;
  url: string;
}
