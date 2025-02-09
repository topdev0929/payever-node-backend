import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BankAccountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    bankName: String,
    bic: String,
    city: String,
    country: String,
    iban: String,
    owner: String,
  },
  {
    strict: true,
    timestamps: { },
  },
);
