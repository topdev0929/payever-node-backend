import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ProductSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  lastSell: { type: Date },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  salePrice: { type: Number },
  thumbnail: { type: String },
  uuid: { type: String, required: true },
});
