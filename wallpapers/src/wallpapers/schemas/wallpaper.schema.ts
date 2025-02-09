import { Schema } from 'mongoose';

export const WallpaperSchema: Schema = new Schema(
  {
    name: String,
    theme: { type: String, enum: ['dark', 'light', 'default'], default: 'default' },
    wallpaper: { type: String, required: true },
  },
);

WallpaperSchema.index({ name: 'text' });
