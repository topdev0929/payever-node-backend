import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BankAccountSchema } from './bank-account.schema';
import { CompanyAddressSchema } from './company-address.schema';
import { CompanyDetailsSchema } from './company-details.schema';
import { ContactDetailsSchema } from './contact-details.schema';

export const BusinessDetailSchemaName: string = 'BusinessDetail';
export const BusinessDetailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    bankAccount: BankAccountSchema,
    companyAddress: {
      type: CompanyAddressSchema,
    },
    companyDetails: {
      type: CompanyDetailsSchema,
    },
    contactDetails: {
      required: true,
      type: ContactDetailsSchema,
    },
  },
  {
    strict: false,
    timestamps: { },
  },
);
