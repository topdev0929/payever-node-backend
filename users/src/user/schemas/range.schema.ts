import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const RangeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    max: {
      type: Number,
    },
    min: {
      type: Number,
    },
  },
);
