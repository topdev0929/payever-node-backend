import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { WallpaperSchema } from './wallpaper.schema';
import { BusinessProductIndustrySchemaName } from './business-product-industry.schema';

export const BusinessProductSchemaName: string = 'BusinessProduct';

export const BusinessProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    industry: { type: String, ref: BusinessProductIndustrySchemaName },
    wallpapers: [WallpaperSchema],
  },
  {
    collection: 'business-products',
  },
);
