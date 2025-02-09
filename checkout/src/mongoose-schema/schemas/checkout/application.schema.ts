import { Schema } from 'mongoose';

export const ApplicationSchema: Schema = new Schema({
  id: String,

  active: Boolean,
  name: String,
});
