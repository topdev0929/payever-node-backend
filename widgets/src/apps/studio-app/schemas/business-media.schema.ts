import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';

export const BusinessMediaSchemaName: string = 'BusinessMedia';

export const BusinessMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    mediaType: String,
    name: String,
    url: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 });

BusinessMediaSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: CommonMongooseModel.Business,
});
