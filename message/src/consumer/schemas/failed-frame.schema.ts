import { Schema } from 'mongoose';

export const FailedFrameSchemaName: string = 'FailedFrame';
export const FailedFrameSchema: Schema = new Schema({
  _id: String,
  err: Schema.Types.Mixed,
  message: Schema.Types.Mixed,
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
});
