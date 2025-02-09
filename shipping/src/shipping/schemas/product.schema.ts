import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ProductSchemaName: string = 'product';
export const ProductSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    imageUrl: {
      type: Schema.Types.String,
    },
    name: {
      type: Schema.Types.String,
    },
    productId: {
      type: Schema.Types.String,
    },
    sku: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);
