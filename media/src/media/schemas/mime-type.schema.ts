import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MimeTypeSchemaName: string = 'MimeType';
export const MimeTypeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    description: { required: false, type: String },
    groups: [{ type: String }],
    key: { required: true, type: String },
    name: { required: true, type: String },
  },
  {
    timestamps: { },
  },
).index({ key: 1 }, { unique: true });
