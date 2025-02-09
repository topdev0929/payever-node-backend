import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const FlowAddressSchema: Schema = new Schema({
  _id: { type: String, default: uuid },

  addressLine2: { type: String },
  city: { type: String },
  country: { type: String },
  countryName: { type: String },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  region: { type: String },
  salutation: { type: String },
  street: { type: String },
  streetName: { type: String },
  streetNumber: { type: String },
  zipCode: { type: String },

  houseExtension: { type: String },
  organizationName: { type: String },
});
