import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessProductIndustrySchemaName } from './business-product-industry.schema';
import { BusinessStatusesEnum } from '../enums';

export const BusinessProductSchemaName: string = 'BusinessProduct';

export const BusinessProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    defaultBusinessStatus: {
      enum: Object.values(BusinessStatusesEnum),
      type: String,
    },
    industry: { type: String, ref: BusinessProductIndustrySchemaName },
    logo: String,
    slug: String,
    wallpaper: String,
  },
  {
    collection: 'business-products',
  },
)
  .index({ code: 1 })
  .index({ slug: 1 })
  .index({ industry: 1 })
  ;
