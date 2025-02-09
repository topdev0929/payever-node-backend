import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import {
  BankAccountSchema,
  CompanyAddressSchema,
  CompanyDetailsSchema,
  ContactDetailsSchema,
  ThemeSettingsSchema,
  TaxesSchema,
} from '@pe/business-kit';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: {
      default: false,
      type: Boolean,
    },
    bankAccount: BankAccountSchema,
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
    country: { type: String },
    excludedIntegrations: [String],
    taxes: TaxesSchema,
    themeSettings: ThemeSettingsSchema,
  },
  {
    timestamps: { },
  },
);
