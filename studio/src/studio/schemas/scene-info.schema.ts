import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const objectDetectionInfo: any = {
  bbox: [Number],
  class: String,
  score: Number,
};

const rgbInfo: any = {
  blue: Number,
  green: Number,
  hex: String,
  red: Number,
};

export const SceneInfoSchemaName: string = 'SceneInfo';
export const SceneInfoSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    color: {
      end: rgbInfo,
      start: rgbInfo,
    },
    displayAspectRatio: String,
    duration: Number,
    frame: {
      end: Number,
      start: Number,
    },
    name: String,
    objectDetection: {
      end: [objectDetectionInfo],
      start: [objectDetectionInfo],
    },
    order: Number,
    sampleAspectRatio: String,
    size: {
      height: Number,
      width: Number,
    },
    tags: [String],
    time: {
      end: Number,
      start: Number,
    },
    video: String,
  },
  { timestamps: true },
).index({ video: 1, order: 1 }, { unique: true });
