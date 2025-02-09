import { Schema } from 'mongoose';

export const accessSchema: Schema = new Schema(
  {
    defaultInstalled: {
      default: false,
      type: Boolean,
    },
    isDefault: {
      default: false,
      type: Boolean,
    },
    url: String,
  },
  { _id: false },
);
