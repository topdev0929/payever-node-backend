import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserAccountSchema } from './user-account.schema';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    archiveHash: { type: String},
    currency: { type: String },
    failedTransactionsRetentionPeriod: { type: String },
    isDeleted: { type: Boolean},
    name: { type: String },
    transactionsRetentionPeriod: { type: String },
    
    userAccount: { type: UserAccountSchema},
  },
);
