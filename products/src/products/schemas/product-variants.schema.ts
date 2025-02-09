// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { optionSchema } from './option.schema';
import { ProductAttributeSchema } from '../../new-products/schemas/product-attribute.schema';
import { ProductPriceSchema } from './product-price.schema';

export const ProductVariantSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    apps: [String],
    title: String,
    barcode: String,
    businessId: {
      required: true,
      type: String,
    },
    description: String,
    images: [String],
    imagesUrl: [String],
    options: [optionSchema],
    attributes: [ProductAttributeSchema],
    price: {
      required: true,
      type: Number,
    },
    priceTable: {
      default: [],
      type: [ProductPriceSchema],
    },
    product: {
      ref: 'Product',
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);
