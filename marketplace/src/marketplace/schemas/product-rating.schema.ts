import { Schema } from 'mongoose';

export const ProductRating: Schema = new Schema(
  {
    rating: Number,
    votesCount: Number,
  },
  { timestamps: true },
);

