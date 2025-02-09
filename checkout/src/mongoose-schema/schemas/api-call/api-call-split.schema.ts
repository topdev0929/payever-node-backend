import { Schema } from 'mongoose';
import { ApiCallSplitAmountSchema } from './api-call-split-amount.schema';

export const ApiCallSplitSchema: Schema = new Schema(
  {
    amount: ApiCallSplitAmountSchema,
    description: String,
    identifier: String,
    reference: String,
    type: String,
  },
  {
    _id: false,
  },
);
