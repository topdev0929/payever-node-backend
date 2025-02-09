// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ProductSaleSchema } from './product-sale.schema';

export const productBaseSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    brand: {
      required: false,
      type: String,
    },

    sale: {
      type: ProductSaleSchema,
    },

    // todo: remove after migration
    onSales: {
      default: false,
      type: Boolean,
    },
    salePrice: {
      type: Number,
    },
    salePercent: {
      type: Number,
    },
    saleEndDate: {
      type: Date,
    },
    saleStartDate: {
      type: Date,
    },

    sku: {
      set: (x: string): string => (x ? x : null),
      type: String,
    },
    isLocked: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true },
);

productBaseSchema.index(
  { businessId: 1, sku: 1 },
  { unique: true, partialFilterExpression: { sku: { $type: 'string' } } },
);

productBaseSchema.post('validate', async function(this: any): Promise<void> {
  if (this.onSales && !this.salePrice) {
    throw new Error('Sale price is required');
  }
});

productBaseSchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});
