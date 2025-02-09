import { Schema } from 'mongoose';

export const AmountSchema: Schema = new Schema(
  {
    max: Number,
    min: Number,
  },
);
