import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName, BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const CommentSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    author: { type: String, default: false },
    blog: { type: Schema.Types.String, required: true, ref: BlogSchemaName },
    businessId: { type: Schema.Types.String, required: true },
    content: { type: String, default: false },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ blog: 1 })
  ;

CommentSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
