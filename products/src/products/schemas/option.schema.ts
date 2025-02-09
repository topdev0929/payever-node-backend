import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const optionSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },

    name: String,
    type: String,
    value: String,
    extra: Schema.Types.Mixed,
  },
  { timestamps: true },
);
