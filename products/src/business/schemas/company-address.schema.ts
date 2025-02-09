// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CompanyAddressSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  {
    timestamps: { },
  },
);
