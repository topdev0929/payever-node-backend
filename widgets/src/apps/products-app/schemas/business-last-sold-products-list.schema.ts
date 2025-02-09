import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ProductSchema } from './product.schema';

export const BusinessLastSoldProductsListSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  products: [ProductSchema],
});
