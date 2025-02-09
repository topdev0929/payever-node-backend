import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DisplayOptionsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  bgColor: String,
  icon: String,
  title: String,
  titleTranslations: Schema.Types.Mixed,
});
