import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export const BrowserSchemaName: string = 'browser';
export const BrowserSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    title: {
      required: true,
      type: Schema.Types.String,
    },
    value: [{
      required: true,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
