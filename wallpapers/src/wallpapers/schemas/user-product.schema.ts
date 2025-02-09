import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserProductIndustrySchemaName } from './user-product-industry.schema';
import { WallpaperSchema } from './wallpaper.schema';

export const UserProductSchemaName: string = 'UserProduct';

export const UserProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    industry: { type: String, ref: UserProductIndustrySchemaName },
    wallpapers: [WallpaperSchema],
  },
  {
    collection: 'user-products',
  },
);
