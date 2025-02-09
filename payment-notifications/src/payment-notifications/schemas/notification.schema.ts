import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DeliveryAttemptSchemaName } from './delivery-attempt.schema';

export const NotificationSchemaName: string = 'Notification';
export const NotificationSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    apiCallId: {
      required: true,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    deliveryAt: {
      default: Date.now,
      required: false,
      type: Date,
    },
    deliveryAttempts: [
      {
        ref: DeliveryAttemptSchemaName,
        required: false,
        type: Schema.Types.String,
      },
    ],
    message: {
      required: true,
      type: String,
    },
    notificationType: {
      required: true,
      type: String,
    },
    paymentId: {
      required: true,
      type: String,
    },
    retriesNumber: {
      default: 0,
      required: false,
      type: Number,
    },
    status: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)
  .index({ apiCallId: 1 })
  .index({ retriesNumber: 1, deliveryAt: 1 })
  ;
