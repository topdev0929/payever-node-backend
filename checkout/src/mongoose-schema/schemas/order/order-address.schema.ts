import { Schema } from 'mongoose';

export const OrderAddressSchema: Schema = new Schema(
  {
    address_line_2: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    first_name: { type: String, required: false },
    house_extension: { type: String, required: false },
    last_name: { type: String, required: false },
    organization_name: { type: String, required: false },
    region: { type: String, required: false },
    salutation: { type: String, required: false },
    street: { type: String, required: false },
    street_name: { type: String, required: false },
    street_number: { type: String, required: false },
    zip: { type: String, required: false },
  },
  {
    _id: false,
  },
);
