import { Schema } from 'mongoose';
import { ApiCallAddressSchema } from './api-call-address.schema';

export const ApiCallShippingOptionPickupLocationSchema: Schema = new Schema(
  {
    address: { type: ApiCallAddressSchema, required: false },
    id: String,
    name: String,
  },
  {
    _id: false,
  },
);
