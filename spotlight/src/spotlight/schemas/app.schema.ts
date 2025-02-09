import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AppSchemaName: string = 'App';
export const AppSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },
    title: String,
    description: String,
  },
).index({ title: 1 }).index({ description: 1 });
