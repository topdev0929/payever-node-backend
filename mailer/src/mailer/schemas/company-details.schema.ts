import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CompanyDetailsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    legalForm: String,
    urlWebsite: String,
  },
  {
    timestamps: { },
  },
);
