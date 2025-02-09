import { Schema } from 'mongoose';
import { PostStateErrorSchema } from './post-state-error.schema';

export const PostStateSchema: Schema = new Schema(
  {
    error: PostStateErrorSchema,
    integrationName: { type: Schema.Types.String },
    status: { type: Schema.Types.String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
