// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ProductAttributeSchema } from './product-attribute.schema';

export const productBaseSchema: Schema = new Schema(
  {
    _id: {
      alias: 'uuid',
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    sku: {
      set: (x: string): string => (x ? x : null),
      type: String,
    },
    attributes: [ProductAttributeSchema],
  },
  { timestamps: true, toObject: { virtuals: true } },
);
