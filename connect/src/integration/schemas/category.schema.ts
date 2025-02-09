import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CategorySchemaName: string = 'Category';
export const CategorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    icon: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
).index({ name: 1 }, { unique: true });
