import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MediaItemSchemaName: string = 'MediaItem';
export const MediaItemSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    applicationId: String,
    container: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
).index({ name: 1, container: 1 }, { unique: true});
