import { v4 as uuid } from 'uuid';
import { Schema } from 'mongoose';

export const DefaultStepSchemaName: string = 'DefaultStep';
export const DefaultStepSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },
    action: String,
    allowSkip: Boolean,
    order: Number,
    section: String,
    title: String,
  },
)
  .index({ order: 1 })
  .index({ section: 1 });
