import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CompanyAddressSchema } from './company-address.schema';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    companyAddress: {
      required: true,
      type: CompanyAddressSchema,
    },
    currency: { type: String },
    defaultLanguage: { type: String },
    name: { type: String },
  },
  { timestamps: true },
);
