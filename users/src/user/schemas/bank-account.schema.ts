import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BankAccountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    accountNumber: { type: String },
    bankCode: { type: String },
    bankName: { type: String },
    bic: { type: String },
    city: { type: String },
    country: { type: String },
    iban: { type: String },
    owner: { type: String },
    routingNumber: { type: String },
    swift: { type: String },
  },
  {
    timestamps: { },
  },
);
