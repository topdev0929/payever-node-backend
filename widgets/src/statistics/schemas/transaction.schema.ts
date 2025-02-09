import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const TransactionSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  currency: { type: String, default: uuid },
});
