import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DeliveryAttemptSchemaName: string = 'DeliveryAttempt';
export const DeliveryAttemptSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    exceptionMessage: {
      required: false,
      type: String,
    },
    notificationId: {
      required: true,
      type: String,
    },
    responseMessage: {
      required: false,
      type: String,
    },
    responseStatusCode: {
      required: false,
      type: Number,
    },
    status: {
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
);
