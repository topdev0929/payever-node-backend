import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ContactFieldsSchema } from './contactfields.schema';

export const ContactSchemaName: string = 'Contact';

export const ContactSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    fields: [{
      type: ContactFieldsSchema,
    }],
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
