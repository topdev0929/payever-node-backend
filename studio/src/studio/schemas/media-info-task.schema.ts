import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MediaInfoTaskSchemaName: string = 'MediaInfoTask';
export const MediaInfoTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    mediaId: String,
    mediaType: String,
    ownerType: String,
    status: String,
    tries: Number,
    type: String,
    url: String,
  },
  { timestamps: true },
)

  .index({ tries: 1 })
  .index({ mediaId: 1, type: 1, url: 1 }, { unique: true })
  .index({ mediaType: 1, ownerType: 1, status: 1, tries: 1 })
  .index({ mediaType: 1, ownerType: 1, status: 1, tries: 1, updatedAt: 1 })
  ;
