import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PaymentAddressSchema: Schema = new Schema({
  _id: {
    default: uuid,
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
  countryName: {
    required: true,
    type: String,
  },
  street: {
    required: true,
    type: String,
  },
  zipCode: {
    required: true,
    type: String,
  },
});
