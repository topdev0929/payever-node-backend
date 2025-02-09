import { Schema } from 'mongoose';

export const categorySchema: Schema = new Schema(
  {
    _id: { alias: 'id', type: String },
    businessId: String,
    slug: String,
    title: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
