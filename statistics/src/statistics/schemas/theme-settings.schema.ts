import { Schema } from 'mongoose';

export const ThemeSettingsSchema: Schema = new Schema(
  {
    theme: {
      default: 'default',
      type: Schema.Types.String,
    },
  },
  {
    _id: false,
    timestamps: false,
  },
);
