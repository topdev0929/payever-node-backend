import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CompanyAddressSchema } from './company-address.schema';

export const BusinessDetailSchemaName: string = 'BusinessDetail';
export const BusinessDetailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    companyAddress: CompanyAddressSchema,
  },
  {
    timestamps: { },
  },
);
