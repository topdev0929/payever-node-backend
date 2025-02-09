import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BlockEmailSchemaName: string = 'BlockEmail';

export const BlockEmailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    type: { type: String },
    value: { type: String },
  },
  {
    autoIndex: true,
    collection: 'blocked-emails',
    timestamps: { createdAt: true, updatedAt: false },
  },
)
  .index({ value: 1 })
  .index({ type: 1, value: 1 });
