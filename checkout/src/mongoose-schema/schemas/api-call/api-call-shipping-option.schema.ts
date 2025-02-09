import { Schema } from 'mongoose';
import { ApiCallShippingOptionDetailsSchema } from './api-call-shipping-option-details.schema';

export const ApiCallShippingOptionSchema: Schema = new Schema(
  {
    carrier: String,
    category: String,
    details: ApiCallShippingOptionDetailsSchema,
    name: String,
    price: Number,
    tax_amount: Number,
    tax_rate: Number,
  },
  {
    _id: false,
  },
);
