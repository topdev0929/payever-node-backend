import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ContactFieldsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: String,
    value: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
