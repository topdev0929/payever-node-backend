import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AttributeSchemaName: string = 'Attribute';
export const AttributeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    icon: String,
    name: String,
    type: String,
  },
  { timestamps: true },
).index({ name: 1, type: 1 }, { unique: true });
