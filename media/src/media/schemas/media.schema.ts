import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    container: {
      required: true,
      type: String,
    },
    isAssigned: {
      default: false,
      type: Boolean,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);
