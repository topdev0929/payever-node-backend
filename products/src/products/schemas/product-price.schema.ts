// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { ProductPriceConditionSchema } from './product-price-condition.schema';
import { ProductSaleSchema } from './product-sale.schema';

export const ProductPriceSchema: Schema = new Schema(
  {
    condition: {
      type: ProductPriceConditionSchema,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    sale: {
      type: ProductSaleSchema,
    },
    vatRate: {
      type: Number,
    },
  },
  {
    _id: false,
  },
);
