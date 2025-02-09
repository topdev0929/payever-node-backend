import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DropboxMediaSchemaName: string = 'DropboxMedia';
export const DropboxMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    compressedSize: Number,
    downloaded: { type: Boolean, default: false },
    isDownloadable: Boolean,
    lastError: Schema.Types.Mixed,
    lastModified: {
      type: Schema.Types.Date,
    },
    name: String,
    path: String,
    size: Number,
    sourceId: {
      index: true,
      type: String,
      unique : true,
    },
    tries: Number,
    type: String,
  },
  { timestamps: true },
);
