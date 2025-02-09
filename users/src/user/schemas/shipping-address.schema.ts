import { Schema } from 'mongoose';

export const ShippingAddressSchema: Schema = new Schema({
  apartment: String,
  city: String,
  country: String,
  street: String,
  zipCode: String,
});
