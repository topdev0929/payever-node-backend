import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business/schemas';
import { ImageAssessmentSchema } from './image-assessment.schema';
import { UserAlbumSchemaName } from './user-album.schema';
import { MediaInfoSchema } from './media-info.schema';
import { MediaAttributeSchema } from './media-attribute-schema';
import { UserMediaAttributeSchema } from './user-media-attribute-schema';

export const UserMediaSchemaName: string = 'UserMedia';
export const UserMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    album: { type: String, ref: UserAlbumSchemaName },
    assessment: ImageAssessmentSchema,
    attributes: [MediaAttributeSchema],
    businessId: { type: String },
    description: { type: String },
    example: {
      default: false,
      type: Boolean,
    },
    mediaInfo: MediaInfoSchema,
    mediaType: String,
    name: {
      index: true,
      type: String,
    },
    text: { type: Schema.Types.Mixed },
    url: String,
    userAttributes: [UserMediaAttributeSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ businessId: 1, example: 1 })
  .index({ album: 1, businessId: 1 });

UserMediaSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
