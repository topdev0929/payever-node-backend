import { Schema } from 'mongoose';

export const CompanyDetailsSchema: Schema = new Schema(
  {
    businessStatus: String,
    foundationYear: String,
    industry: { type: String },
    legalForm: { type: String },
    phone: String,
    product: { type: String },
    status: String,
    urlWebsite: String,
  },
  {
    _id: false,
    timestamps: false,
  },
);
