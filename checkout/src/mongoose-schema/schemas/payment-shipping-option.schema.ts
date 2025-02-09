import { Schema } from 'mongoose';
import { PaymentShippingOptionDetailsSchema } from './payment-shipping-option-details.schema';

export const PaymentShippingOptionSchema: Schema = new Schema(
  {
    carrier: String,
    category: String,
    details: PaymentShippingOptionDetailsSchema,
    name: String,
    price: Number,
    tax_amount: Number,
    tax_rate: Number,
  },
  {
    _id: false,
  },
);
