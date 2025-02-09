import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const GeneratedVideoSchemaName: string = 'GeneratedVideo';
export const GeneratedVideoSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    audio: String,
    duration: Number,
    previewUrl: String,
    scenes: [String],
    sourceUrl: String,
  },
  { timestamps: true },
);
