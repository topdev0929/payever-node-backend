import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ImageAssessmentTaskSchemaName: string = 'ImageAssessmentTask';
export const ImageAssessmentTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    mediaId: String,
    status: String,
    tries: Number,
    type: String,
    url: String,
  },
  { timestamps: true },
)
  .index({ tries: 1 })
  .index({ status: 1, tries: 1 })
  .index({ status: 1, tries: 1, updatedAt: 1 })
  .index({ mediaId: 1, type: 1 })
  .index({ mediaId: 1, type: 1, url: 1 }, { unique: true })
  ;
