import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '@pe/business-kit';
import { WallpaperSchema } from './wallpaper.schema';

export const BusinessWallpapersSchemaName: string = 'BusinessWallpapers';

export const BusinessWallpapersSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: {
      required: true,
      type: String,
    },
    currentWallpaper: WallpaperSchema,
    industry: String,
    myWallpapers: {
      type: [WallpaperSchema],
    },
    product: String,
    type: String,
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 }, { unique: true });

// For backwards compatibility
BusinessWallpapersSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
}).get(function (): string {
  return this.businessId;
});
