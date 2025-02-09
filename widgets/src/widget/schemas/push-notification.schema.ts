import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PushNotificationSchemaName: string = 'PushNotification';
export const PushNotificationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    message: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);
