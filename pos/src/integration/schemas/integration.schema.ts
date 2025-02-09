import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DisplayOptionsSchema } from './display-options.schema';

export const IntegrationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    category: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },

    displayOptions: DisplayOptionsSchema,
  },
  {
    timestamps: { },
  },
)
  .index({ category: 1 })
  ;
