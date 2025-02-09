import { Schema } from 'mongoose';

export const ApiCallSplitAmountSchema: Schema = new Schema(
  {
    currency: String,
    value: Number,
  },
  {
    _id: false,
  },
);
