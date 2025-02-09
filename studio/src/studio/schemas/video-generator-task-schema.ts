import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const VideoGeneratorTaskSchemaName: string = 'VideoGeneratorTask';

const task: Schema = new Schema({ }, { discriminatorKey: 'type', _id: false });

const VideoGeneratorTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    status: String,
    task: { type: task, unique: true },
    tries: Number,
    type: String,
  },
  { timestamps: true },
)
  .index({ task: 1, tries: 1 })
  .index({ task: 1, updatedAt: 1 })
  .index({ status: 1, tries: 1 })
  .index({ status: 1, tries: 1, updatedAt: 1 })
  ;

const path: Schema.Types.DocumentArray = VideoGeneratorTaskSchema.path('task');

const generateFrameTask: any = {
  videoPath: String,
};
path.discriminator('generate-frames', new Schema(
  { data: { type: generateFrameTask, unique: true } },
  { _id: false },
));

const generateRandomVideoTask: any = {
  body: {
    audio: String,
    errorMargin: Number,
    videoCutOptions: [
      {
        duration: Number,
        noClips: Number,
        video: String,
      },
    ],
  },
  businessId: String,
};
path.discriminator('generate-random-video', new Schema(
  { data: { type: generateRandomVideoTask, unique: true } },
  { _id: false },
));

const generateVideoByTagTask: any = {
  body: {
    audio: String,
    duration: Number,
    tags: [String],
  },
  businessId: String,
};
path.discriminator('generate-video-by-tag', new Schema(
  { data: { type: generateVideoByTagTask, unique: true } },
  { _id: false },
));

export { VideoGeneratorTaskSchema };
