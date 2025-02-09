import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export const MediaSchemaName: string = 'Media';
export const MediaSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    contentType: { type: Schema.Types.String },
    name: { type: Schema.Types.String },
    previewUrl: { type: Schema.Types.String },
    thumbnailUrl: { type: Schema.Types.String },
    url: { type: Schema.Types.String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
