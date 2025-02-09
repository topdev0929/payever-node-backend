import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const InvoiceSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  amountPaid: { type: Number },
  currency: { type: String, default: uuid },
});
