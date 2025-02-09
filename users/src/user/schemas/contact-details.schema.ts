import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ContactDetailsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    additionalPhone: String,
    fax: String,
    firstName: String,
    lastName: String,
    phone: { type: String },
    salutation: String,
  },
  {
    strict: false,
    timestamps: { },
  },
);
