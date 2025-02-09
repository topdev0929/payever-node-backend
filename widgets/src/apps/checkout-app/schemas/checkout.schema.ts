import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CheckoutSchemaName: string = 'Checkout';

export const CheckoutSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    default: Boolean,
    linkChannelSetId: String,
    name: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
