import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const LanguageSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  active: {
    default: false,
    type: Boolean,
  },
  code: String,
  isDefault: {
    default: false,
    type: Boolean,
  },
  name: String,
});
