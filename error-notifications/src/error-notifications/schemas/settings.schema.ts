import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum, SendingMethodEnum } from '../enums';
import { SettingsTimeFrameItemSchema } from './settings-time-frame-item.schema';

export const SettingsSchemaName: string = 'Settings';
export const SettingsSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    integration: {
      required: false,
      type: String,
    },
    isEnabled: {
      default: false,
      required: true,
      type: Boolean,
    },
    repeatFrequencyInterval: {
      default: null,
      required: false,
      type: Number,
    },
    sendingMethod: {
      required: true,
      type: SendingMethodEnum,
    },
    timeFrames: {
      default: null,
      required: false,
      type: [SettingsTimeFrameItemSchema],
    },
    type: {
      required: true,
      type: ErrorNotificationTypesEnum,
    },
    updateInterval: {
      default: null,
      required: false,
      type: CronUpdateIntervalEnum,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)
  .index({ businessId: 1, type: 1, integration: 1}, { unique: true })
;
