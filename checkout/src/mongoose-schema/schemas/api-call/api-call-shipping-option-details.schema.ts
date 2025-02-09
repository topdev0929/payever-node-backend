import { Schema } from 'mongoose';
import { ApiCallShippingOptionPickupLocationSchema } from './api-call-shipping-option-pickup-location.schema';

export const ApiCallShippingOptionDetailsSchema: Schema = new Schema(
  {
    pickup_location: ApiCallShippingOptionPickupLocationSchema,
    timeslot: Date,
  },
  {
    _id: false,
  },
);
