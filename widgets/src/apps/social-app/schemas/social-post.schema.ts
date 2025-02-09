import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export const SocialPostSchemaName: string = 'SocialPost';
export const SocialPostSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    businessId: {
      index: true,
      required: true,
      type: Schema.Types.String,
    },
    content: { type: Schema.Types.String },
    title: { type: Schema.Types.String },
    type: { type: Schema.Types.String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
