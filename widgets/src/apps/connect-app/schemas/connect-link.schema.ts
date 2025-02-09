import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const LinkSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  type: String,
  url: String,
});
