import { Schema } from 'mongoose';

export const PaymentAddressSchema: Schema = new Schema({
  uuid: {
    required: true,
    type: String,
  },

  city: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  country_name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  first_name: {
    required: true,
    type: String,
  },
  last_name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  region: {
    required: false,
    type: String,
  },
  salutation: {
    required: true,
    type: String,
  },
  street: {
    required: true,
    type: String,
  },
  zip_code: {
    required: true,
    type: String,
  },
});
