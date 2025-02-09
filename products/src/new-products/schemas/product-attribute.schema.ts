import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ProductAttributeSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  name: String,
  type: String,
  value: String,
});
