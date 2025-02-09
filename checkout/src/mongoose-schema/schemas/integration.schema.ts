import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DisplayOptionsSchema } from './display-options.schema';
import { SettingsOptionsSchema } from './settings-options.schema';

export const IntegrationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    autoEnable: Boolean,
    category: {
      required: true,
      type: String,
    },
    displayOptions: DisplayOptionsSchema,
    isVisible: { type: Boolean, default: true },
    issuer: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: false,
    },
    settingsOptions: SettingsOptionsSchema,
    sortOrder: { type: Number },
  },
  {
    timestamps: {

    },
  },
)
  .index({ category: 1 })
  .index({ name: 1 })
  .index({ name: 1, category: 1 });
