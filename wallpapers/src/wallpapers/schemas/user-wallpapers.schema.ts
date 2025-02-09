import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { WallpaperSchema } from './wallpaper.schema';

export const UserWallpapersSchemaName: string = 'UserWallpapers';

export const UserWallpapersSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    currentWallpaper: WallpaperSchema,
    myWallpapers: {
      type: [WallpaperSchema],
    },
    user: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
)
  .index({ user: 1 }, { unique: true });
