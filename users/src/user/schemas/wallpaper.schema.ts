import { Schema } from 'mongoose';
import { WallpaperThemeEnum } from '../enums';

export const WallpaperSchema: Schema = new Schema(
  {
    auto: Boolean,
    name: { type: String },
    theme: { type: String, enum: Object.values(WallpaperThemeEnum), default: WallpaperThemeEnum.Transparent },
    wallpaper: { type: String },
  },
);
