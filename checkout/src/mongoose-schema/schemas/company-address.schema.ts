import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CompanyAddressSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    city: String,
    country: String,
    street: String,
    zipCode: String,
  },
  {
    strict: true,
    timestamps: { },
  },
);
