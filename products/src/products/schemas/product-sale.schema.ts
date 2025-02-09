// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';

export const ProductSaleSchema: Schema = new Schema(
  {
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
  },
  {
    _id: false,
  },
);
