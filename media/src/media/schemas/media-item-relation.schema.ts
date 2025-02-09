import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MediaItemRelationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    entityId: { type: String },
    entityType: { type: String },
    mediaItem: { type: String, ref: 'MediaItem' },
  },
  {
    timestamps: { },
  },
).index({ mediaItem: 1, entityId: 1, entityType: 1 }, { unique: true});
