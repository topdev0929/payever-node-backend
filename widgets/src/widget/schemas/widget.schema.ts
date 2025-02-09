import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const WidgetSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  default: { type: Boolean, default: false },
  helpURL: { type: String },
  icon: { type: String },
  installByDefault: { type: Boolean, default: false },
  order: { type: Number },
  title: { type: String, required: true },
  tutorial: {
    icon: { type: String },
    image: { type: String },
    showOnTutorial: Boolean,
    title: { type: String },
    url: { type: String },
    urls: [{
      language: String,
      url: String,
    }],
  },
  type: { type: String, required: true, index: { unique: true } },
})
  .index({ 'tutorial.url': 1 });
