import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { InnerActionSchema } from './inner-action.schema';

export const IntegrationSchemaName: string = 'Integration';

export const IntegrationSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    code: {
      required: true,
      type: String,
      unique: true,
    },
    url: {
      default: '',
      type: String,
    },

    actions: {
      default: [],
      type: [InnerActionSchema],
    },
  },
  {
    timestamps: { },
  },
)
  .index({ code: 1 })
;
