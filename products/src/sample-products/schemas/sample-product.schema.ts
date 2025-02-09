import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ProductShippingSchema } from '../../products/schemas/product-shipping.schema';

export const SampleProductSchemaName: string = 'SampleProducts';
export const SampleProductSchema: Schema = new Schema(
  {
    _id: {
      default: uuid, type: String,
    },
    active: Boolean,
    barcode: String,
    businessId: String,
    currency: String,
    description: String,
    example: Boolean,
    images: [String],
    industry: String,
    onSales: Boolean,
    price: {
      index: true,
      required: true,
      type: Number,
    },
    product: String,
    salePrice: Number,
    shipping: ProductShippingSchema,
    sku: String,
    title: String,
    type: {
      enum: ['digital', 'physical', 'service'],
      type: String,
    },
    vatRate: Number,
  },
  { timestamps: true },
)
  .index({ product: 1 })
  .index({ industry: 1, product: 1 })
  //  index declaration may be invalid
  .index({ unique: true, partialFilterExpression: { sku: { $type: 'string' } } } as any)
  .index({ title: 'text', description: 'text', industry: 'text', barcode: 'text', product: 'text' })
  ;
