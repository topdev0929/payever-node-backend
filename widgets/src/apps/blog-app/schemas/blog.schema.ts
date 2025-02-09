import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BlogSchemaName: string = 'Blog';

export const BlogSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    name: String,
    picture: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
