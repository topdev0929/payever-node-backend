import { Schema } from 'mongoose';
import { optionSchema } from './option.schema';

export const variantSchema: Schema = new Schema({
  product: {
    index: true,
    ref: 'Product',
    required: true,
    type: String,
  },

  barcode: String,
  description: String,
  images: [String],
  imagesUrl: [String],
  onSales: {
    default: false,
    type: Boolean,
  },
  price: {
    index: true,
    required: true,
    type: Number,
  },
  salePrice: {
    type: Number,
  },

  options: [optionSchema],
});

/** @deprecated */
variantSchema.virtual('hidden').get(function(): boolean {
  return !this.onSales;
});
