import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const TaxesSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    companyRegisterNumber: { type: String },
    taxId: { type: String },
    taxNumber: { type: String },
    turnoverTaxAct: { type: Boolean },
  },
  {
    strict: false,
    timestamps: { },
  },
);
