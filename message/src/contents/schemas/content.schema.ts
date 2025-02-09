import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '@pe/business-kit';

export const ContentSchemaName: string = 'Content';
export const ContentSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  businessId: {
    default: null,
    type: String,
  },
  children: {
    type: [Schema.Types.Mixed],
  },
  icon: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

ContentSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
