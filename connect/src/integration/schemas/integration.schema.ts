import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { DisplayOptionsSchema } from './display-options.schema';
import { InstallationOptionsSchema } from './installation-options.schema';
import { IntegrationReviewSchema } from './integration-review.schema';
import { IntegrationVersionSchema } from './integration-version.schema';

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
    connect: {
      dynamicForm: Boolean,
      formAction: {
        actionEndpoint: String,
        initEndpoint: String,
      },
      url: String,
    },
    displayOptions: DisplayOptionsSchema,
    enabled: {
      default: true,
      type: Boolean,
    },
    installationOptions: InstallationOptionsSchema,
    issuer: {
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    order: {
      default: 1000,
      type: Number,
    },
    parentFolderId: String,
    reviews: [IntegrationReviewSchema],
    scopes: {
      default: [],
      type: [String],
    },
    timesInstalled: Number,
    versions: [IntegrationVersionSchema],
  },
  {
    timestamps: { },
  },
)
  .index({ categoty: 1 })
  .index({ enabled: 1 })
  .index({ category: 1, enabled: 1 })
  .index({ name: 1, category: 1, issuer: 1 })
  ;
