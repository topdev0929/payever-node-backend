import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PaymentAddressSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  city: {
    required: false,
    type: String,
  },
  country: {
    required: false,
    type: String,
  },
  countryName: {
    required: false,
    type: String,
  },
  street: {
    required: false,
    type: String,
  },
  zipCode: {
    required: false,
    type: String,
  },
});
