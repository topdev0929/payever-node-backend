// tslint:disable: object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ThemeSchemaName: string = 'Theme';
export const ThemeSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  businessId: {
    index: true,
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  isDefault: {
    default: false,
    required: true,
    type: Boolean,
  },
  settings: {
    bgChatColor: String,
    accentColor: String,
    messagesTopColor: String,
    messagesBottomColor: String,
    messageAppColor: String,
    messageWidgetShadow: String,
    headerBanner: String,
    pageBackground : String,

    defaultPresetColor: Number,
    customPresetColors: [{
      bgChatColor: String,
      accentColor: String,
      messagesBottomColor: String,
    }],
    messageWidgetBlurValue: { type: String, default: '65px' },
    alwaysOpen: { type: Boolean, default: false },
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// For backwards compatibility
ThemeSchema.virtual('business').get(function (): string {
  return this.businessId;
});
