import { Schema } from 'mongoose';

export const ApiCallAddressSchema: Schema = new Schema(
  {
    address_line_2: String,
    city: String,
    country: String,
    first_name: String,
    last_name: String,
    region: String,
    salutation: String,
    street: String,
    street_number: String,
    zip: String,

    house_extension: String,
    organization_name: String,
    street_name: String,
  },
  {
    _id: false,
  },
);
