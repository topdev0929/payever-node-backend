import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CompanyAddressSchema } from './company-address.schema';
import { CompanyDetailsSchema } from './company-details.schema';
import { ContactDetailsSchema } from './contact-details.schema';
import { UserSchemaName } from './user.schema';

export const BusinessSchemaName: string = 'businesses';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    companyAddress: {
      required: true,
      type: CompanyAddressSchema,
    },
    companyDetails: {
      required: true,
      type: CompanyDetailsSchema,
    },
    contactDetails: {
      required: true,
      type: ContactDetailsSchema,
    },
    contactEmails: [String],
    defaultLanguage: String,
    logo: String,
    name: String,
    owner: { type: String, ref: UserSchemaName },
  },
  {
    collection: BusinessSchemaName,
    timestamps: true,
  },
);
