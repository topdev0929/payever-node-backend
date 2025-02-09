import { Document, Types } from 'mongoose';
import { NotificationInterface } from '../interfaces';
import { DeliveryAttemptModel } from './delivery-attempt.model';

export interface NotificationModel extends NotificationInterface, Document {
  deliveryAttempts?: Types.DocumentArray<DeliveryAttemptModel>;
}
