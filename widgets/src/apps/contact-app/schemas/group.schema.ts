import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ContactSchemaName } from './contact.schema';

export const GroupSchemaName: string = 'Group';

export const GroupSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    contacts: [{ type: String, ref: ContactSchemaName }],
    isDefault: { type: Boolean },
    totalSpent: { type: Number },
    transactionsCount: { type: Number },
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
