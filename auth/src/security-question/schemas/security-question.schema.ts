import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
export const SecurityQuestionSchemaName: string = 'SecurityQuestion';

export const SecurityQuestionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    answer: { type: String, required: true },
    question: { type: String, required: true },
    userId: { type: String, required: true },
  },
)
  .index({ userId: 1 })
  .index({ userId: 1, question: 1 });
