import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CheckoutSchemaName: string = 'Checkout';

export const CheckoutSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    keyword: String,
    message: String,
    phoneNumber: String,
  },
  {
    collection: 'checkouts',
  },
)
  .index({ phoneNumber: 1, keyword: 1 }, { unique: true, sparse: true });
