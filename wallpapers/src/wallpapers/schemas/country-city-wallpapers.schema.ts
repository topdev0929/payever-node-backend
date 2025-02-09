import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { WallpaperSchema } from './wallpaper.schema';

export const CountryCityWallpapersSchemaName: string = 'CountryCityWallpapers';
export const CountryCityWallpapersSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    city: String,
    country: String,
    fullPath: String,
    wallpaper: WallpaperSchema,
  },
)
  .index({ city: 1 }, { unique: true });
