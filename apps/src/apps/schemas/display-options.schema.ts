import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DisplayOptionsSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  bgColor: String,
  icon: String,
  title: String,
});
