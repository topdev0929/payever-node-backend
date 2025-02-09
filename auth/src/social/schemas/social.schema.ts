import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SocialSchemaName: string = 'Social';

export const SocialSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    blocked: Boolean,
    email: String,
    name: String,
    socialId: String,
    type: String,
    userId: String,
  },
);
