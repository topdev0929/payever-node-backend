import { Schema } from 'mongoose';
import { PaymentShippingOptionPickupLocationSchema } from './payment-shipping-option-pickup-location.schema';

export const PaymentShippingOptionDetailsSchema: Schema = new Schema(
  {
    pickup_location: PaymentShippingOptionPickupLocationSchema,
    timeslot: Date,
  },
  {
    _id: false,
  },
);
