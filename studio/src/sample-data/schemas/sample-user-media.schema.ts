import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SampleUserMediaSchemaName: string = 'SampleUserMedia';
export const SampleUserMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    mediaType: String,
    name: {
      index: true,
      type: String,
    },
    url: String,
  },
  { timestamps: true },
);
