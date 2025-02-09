import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CheckoutSectionSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  code: String, // 'order' | 'address' | 'payment' | 'choosePayment' etc.
  enabled: Boolean,
  options: {
    skipButton: {
      required: false,
      type: Boolean,
    },
  },
  order: Number, // order for fixed sections.
});
