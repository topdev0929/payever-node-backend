import { Schema } from 'mongoose';

export const OrderPurchaseSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    delivery_fee: { type: Number, required: false },
    down_payment: { type: Number, required: false },
  },
  {
    _id: false,
  },
);
