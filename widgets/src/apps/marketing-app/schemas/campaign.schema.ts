import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';
import { MongooseModel as StatisticsMongooseModel } from '../../../statistics/enum';

export const CampaignSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    channelSet: { type: Schema.Types.String, required: true, ref: StatisticsMongooseModel.ChannelSet },
    contactsCount: Number,
    name: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ channelSet: 1 })
  ;

CampaignSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: CommonMongooseModel.Business,
});
