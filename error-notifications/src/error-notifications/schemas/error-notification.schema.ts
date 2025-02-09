import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ErrorNotificationTypesEnum } from '../enums';

export const ErrorNotificationSchemaName: string = 'ErrorNotification';
export const ErrorNotificationSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    emailSent: {
      default: false,
      type: Boolean,
    },
    errorDate: {
      required: false,
      type: Date,
    },
    errorDetails: {
      required: true,
      type: Schema.Types.Mixed,
    },
    integration: {
      required: false,
      type: String,
    },
    lastTimeSent: {
      default: null,
      type: Date,
    },
    type: {
      required: true,
      type: ErrorNotificationTypesEnum,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)
  .index( { businessId: 1, type: 1, integration: 1})
;
