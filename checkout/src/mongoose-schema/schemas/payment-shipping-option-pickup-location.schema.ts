import { Schema } from 'mongoose';
import { PaymentAddressSchema } from './payment-address.schema';

export const PaymentShippingOptionPickupLocationSchema: Schema = new Schema(
  {
    address: {
      required: false,
      type: PaymentAddressSchema,
    },
    id: String,
    name: String,
  },
  {
    _id: false,
  },
);
