import { Schema } from 'mongoose';

export const PostStateErrorSchema: Schema = new Schema(
  {
    code: { type: Schema.Types.Number },
    error: { type: Schema.Types.String },
    message: { type: Schema.Types.String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
