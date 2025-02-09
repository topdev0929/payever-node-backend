import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserAccountSchema } from './user-account.schema';
import { CompanyDetailsSchema } from './company-details.schema';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    companyDetails: CompanyDetailsSchema,
    currency: { type: String },
    logo: { type: String },
    name: { type: String },
    userAccount: UserAccountSchema,
  },
  { timestamps: true },
);
