import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business/schemas';
import { UserMediaAttributeSchema } from './user-media-attribute-schema';

export const UserAlbumSchemaName: string = 'UserAlbum';
const UserAlbumSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    ancestors: [{ type: String, ref: UserAlbumSchemaName }],
    businessId: { type: String },
    description: String,
    hasChildren: {
      default: false,
      type: Boolean,
    },
    icon: String,
    name: {
      index: true,
      type: String,
    },
    parent: { type: String, ref: UserAlbumSchemaName, default: null },
    tags: [String],
    userAttributes: [UserMediaAttributeSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ ancestors: 1 })
  .index({ parent: 1 })
  .index({ _id: 1, businessId: 1 })
  .index({ businessId: 1, name: 1 })
  .index({ businessId: 1, parent: 1 })
  .index({ ancestors: 1, businessId: 1 })
  .index({ name: 1, parent: 1, businessId: 1 }, { unique: true })
  .index({ 'userAttributes.attribute': 1, 'userAttributes.value': 1 })
  ;

UserAlbumSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

export {
  UserAlbumSchema,
};
