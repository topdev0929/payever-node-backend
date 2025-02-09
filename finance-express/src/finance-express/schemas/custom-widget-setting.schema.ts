import { Schema } from 'mongoose';

export const CustomWidgetSettingSchema: Schema = new Schema(
  {
    isVisible: Boolean,
    isDefault: Boolean,
    maxWidth: Number,
    minWidth: Number,
    alignment: String,
    theme: String,
    minHeight: Number,
    maxHeight: Number,
    height: Number,
    styles: Schema.Types.Mixed,
  },
);
