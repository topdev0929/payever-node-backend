import { Schema } from 'mongoose';

export const ThemeSettingsSchema: Schema = new Schema(
  {
    theme: { type: String, enum: ['dark', 'light', 'default', 'transparent'], default: 'default' },
  },
  { _id: false, timestamps: false },
);
