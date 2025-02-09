import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const LogSchemaName: string = 'Log';

export const LogSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    bcc: { type: [String], required: false },
    cc: { type: [String], required: false },
    from: { type: String, required: true },
    html: { type: String, required: true },
    subject: { type: String, required: true },
    to: { type: String, required: true },
  },
  {
    collection: 'logging',
    timestamps: { createdAt: true, updatedAt: false },
  },
);
