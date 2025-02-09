import { Schema } from 'mongoose';

export const ProductChannelSetSchema: Schema = new Schema(
  {
    id: String,
    name: String,
    type: String,
  },
  {
    _id: false,
  },
);
