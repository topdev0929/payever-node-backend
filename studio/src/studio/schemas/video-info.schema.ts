import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const framesInfo: any = {
  color: {
    blue: Number,
    green: Number,
    hex: String,
    red: Number,
  },
  frame: Number,
  image: String,
};

export const VideoInfoSchemaName: string = 'VideoInfo';
export const VideoInfoSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    displayAspectRatio: String,
    duration: Number,
    fps: Number,
    frames: [framesInfo],
    sampleAspectRatio: String,
    size: {
      height: Number,
      width: Number,
    },
    video: String,
  },
  { timestamps: true },
).index({ video: 1 }, { unique: true });
