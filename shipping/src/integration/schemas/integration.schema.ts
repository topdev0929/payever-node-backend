import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DisplayOptionsSchema } from './display-options.schema';
import { IntegrationServiceSchema } from './integration-service.schema';
import { PackageTypeSchema } from './package-type.schema';

export const IntegrationSchemaName: string = 'Integration';
export const IntegrationSchema: Schema = new Schema(
 {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    category: {
      required: true,
      type: Schema.Types.String,
    },
    displayOptions: DisplayOptionsSchema,
    flatAmount: {
      type: Schema.Types.Number,
    },
    handlingFeePercentage: {
      type: Schema.Types.Number,
    },
    integrationServices: [IntegrationServiceSchema],
    name: {
      required: true,
      type: Schema.Types.String,
      unique: true,
    },
    packageTypes: [PackageTypeSchema],
  },
 {
    timestamps: { },
  },
);
