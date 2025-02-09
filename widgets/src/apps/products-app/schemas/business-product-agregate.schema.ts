import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { MongooseModel } from '../../../common/enums';

export const BusinessProductAggregateSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  businessId: { type: Schema.Types.String, required: true },
  id: { type: String },
  lastSell: { type: Date },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  salePrice: { type: Number },
  thumbnail: { type: String },
  uuid: { type: String },
}).index({ id: 1, businessId: 1 }, { unique: true })
  .index({ uuid: 1 })
  .index({ businessId: 1 })
  .index({ lastSell: -1 })
  .index({ quantity: -1 })
  .index({ businessId: 1, lastSell: -1 })
  .index({ lastSell: -1, quantity: -1 });

BusinessProductAggregateSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: MongooseModel.Business,
});
