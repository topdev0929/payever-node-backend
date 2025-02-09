import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { installedAppSchema } from './installed-app.schema';
import { ThemeSettingsSchema } from './theme-settings.schema';


export const businessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    disallowedApps: [installedAppSchema],
    installedApps: [installedAppSchema],
    owner: { type: String },
    registrationOrigin: String,
    themeSettings: ThemeSettingsSchema,
  },
  { timestamps: true },
);
