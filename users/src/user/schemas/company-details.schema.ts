import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { RangeSchema } from './range.schema';

export const CompanyDetailsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessStatus: String,
    employeesRange: RangeSchema,
    foundationYear: String,
    industry: { type: String },
    legalForm: { type: String },
    phone: String,
    product: { type: String },
    salesRange: RangeSchema,
    status: String,
    urlWebsite: String,
  },
  {
    strict: false,
    timestamps: { },
  },
);
