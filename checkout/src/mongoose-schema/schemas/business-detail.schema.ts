import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CompanyAddressSchema } from './company-address.schema';
import { BankAccountSchema } from './bank-account.schema';

export const BusinessDetailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    bankAccount: {
      type: BankAccountSchema,
    },
    companyAddress: {
      type: CompanyAddressSchema,
    },
  },
  {
    strict: true,
    timestamps: { },
  },
);
