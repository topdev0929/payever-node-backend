// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CategoryAttributeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: String,
    type: String,
    isDefault: Boolean,
  },
);
