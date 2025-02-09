import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';
import { AffiliateBankSchemaName } from './affiliate-bank.schema';

export const BusinessPaymentsSchemaName: string = 'BusinessPayments';
export const BusinessPaymentsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business: { type: String, ref: BusinessSchemaName },
    payments: [{ type: String, ref: AffiliateBankSchemaName }],
  },
  {
    timestamps: { },
  },
);
