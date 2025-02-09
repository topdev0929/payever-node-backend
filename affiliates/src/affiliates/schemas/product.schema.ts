import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';

export const ProductSchemaName: string = 'Product';

export const ProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business: { type: String, required: true, ref: BusinessSchemaName },
    price: { type: Number, required: true },
    title: { type: String, required: true },
  },
  {
    collection: 'products',
    timestamps: true,
  },
);
