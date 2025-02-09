import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DisplayOptionsSchema } from './display-options.schema';

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
    enabled: {
      default: false,
      type: Schema.Types.Boolean,
    },
    name: {
      required: true,
      type: Schema.Types.String,
      unique: true,
    },
  },
 {
    timestamps: { },
  },
);
