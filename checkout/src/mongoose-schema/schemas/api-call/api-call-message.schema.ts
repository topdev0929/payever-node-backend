import { Schema } from 'mongoose';

export const ApiCallMessageSchema: Schema = new Schema(
  {
    id: { type: String, required: false },

    content: { type: String, required: false },
    subject:  { type: String, required: false },
  },
  {
    _id: false,
  },
);
