import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BankAccountSchemaName: string = 'BankAccount';

export const BankAccountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    accountNumber: {
      type: String,
      // required: true,
    },
    bankCode: {
      type: String,
      // required: true,
    },
    bankName: {
      type: String,
      // required: true,
    },
    bic: {
      type: String,
      // required: true,
    },
    business_id: {
      type: String,
    },
    city: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    iban: {
      type: String,
    },
    owner: {
      type: String,
      // required: true,
    },
    routingNumber: {
      type: String,
      // required: true,
    },
    swift: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
)
  .index({ business_id: 1 })
  ;
