import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ImageAssessmentSchema } from './image-assessment.schema';
import { MediaAttributeSchema } from './media-attribute-schema';
import { MediaInfoSchema } from './media-info.schema';

export const SubscriptionMediaSchemaName: string = 'SubscriptionMedia';
export const SubscriptionMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    assessment: ImageAssessmentSchema,
    attributes: [ MediaAttributeSchema ],
    compressed: { type: Boolean, default: false },
    compressionTries: { type: Number, default: 0 },
    mediaInfo: MediaInfoSchema,
    mediaType: String,
    name: {
      index: true,
      type: String,
    },
    subscriptionType: { type: Number, default: 0 },
    url: { type: String, unique : true },
  },
  { timestamps: true },
);
