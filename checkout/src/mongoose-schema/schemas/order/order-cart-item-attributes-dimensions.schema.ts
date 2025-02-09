import { Schema } from 'mongoose';

export const OrderCartItemAttributesDimensionsSchema: Schema = new Schema(
  {
    height: { type: Number, required: false },
    length: { type: Number, required: false },
    width: { type: Number, required: false },
  },
  {
    _id: false,
  },
);
