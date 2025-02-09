import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DisplayOptionsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  icon: String,
  order: Number,
  title: String,
});
