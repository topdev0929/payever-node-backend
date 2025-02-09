import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const UserProductIndustrySchemaName: string = 'UserProductIndustry';

export const UserProductIndustrySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    icon: String,
    order: {
      required: true,
      type: Number,
    },
  },
  {
    collection: 'user-products-industries',
  },
);
