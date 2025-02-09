import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { InstallationOptionsSchema } from './installation-options.schema';

export const IntegrationSchemaName: string = 'Integration';
export const IntegrationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    allowedBusinesses: [String],
    category: {
      required: true,
      type: String,
    },
    categoryIcon: {
      required: false,
      type: String,
    },
    enabled: {
      default: true,
      type: Boolean,
    },
    installationOptions: InstallationOptionsSchema,
    name: {
      required: true,
      type: String,
      unique: true,
    },
    order: {
      default: 1000,
      type: Number,
    },
    timesInstalled: Number,
  },
  {
    timestamps: { },
  },
)
  .index({ categoty: 1 })
  .index({ enabled: 1 })
  .index({ category: 1, enabled: 1 })
  .index({ name: 1, category: 1 })
  ;
