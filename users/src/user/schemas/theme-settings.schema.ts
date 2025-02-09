import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ThemeEnum } from '../enums';

export const ThemeSettingsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    primaryColor: String,
    primaryTransparency: String,
    secondaryColor: String,
    secondaryTransparency: String,
    theme: { type: String, enum: Object.values(ThemeEnum), default: ThemeEnum.dark },
    auto: { type: Boolean, default: false },
  },
  {
    timestamps: { },
  },
);
