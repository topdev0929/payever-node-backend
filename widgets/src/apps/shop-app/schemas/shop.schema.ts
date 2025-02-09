import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ShopSchemaName: string = 'Shop';

export const ShopSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    default: Boolean,
    logo: String,
    name: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
