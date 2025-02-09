import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { installedAppSchema } from './installed-app.schema';
import { ThemeSettingsSchema } from './theme-settings.schema';

export const userSchema: Schema = new Schema(
  { 
    _id: { type: String, default: uuid }, 
    installedApps: [installedAppSchema],
    themeSettings: ThemeSettingsSchema,
  },
  { timestamps: true },
);
