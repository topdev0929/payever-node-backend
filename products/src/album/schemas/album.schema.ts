import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '../../business/schemas';

export const AlbumSchemaName: string = 'Album';
export const AlbumSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    ancestors: [{ type: String, ref: AlbumSchemaName }],
    businessId: { type: Schema.Types.String, ref: BusinessSchemaName },
    description: String,
    icon: String,
    name: { index: true, type: String },
    parent: { type: String, ref: AlbumSchemaName },
  },
  {
    timestamps: { },
  },
).index({ name: 1, businessId: 1 }, { unique: true });

// For backwards compatibility
AlbumSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
