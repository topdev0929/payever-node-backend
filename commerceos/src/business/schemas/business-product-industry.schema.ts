import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BusinessProductIndustrySchemaName: string = 'BusinessProductIndustry';

export const BusinessProductIndustrySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    order: {
      required: true,
      type: Number,
    },
  },
  {
    collection: 'business-products-industries',
  },
)
  .index({ code: 1 }, { unique: true })
  .index({ order: 1 });
