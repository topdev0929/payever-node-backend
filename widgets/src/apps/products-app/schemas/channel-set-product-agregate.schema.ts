import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { MongooseModel } from '../../../statistics/enum';

export const ChannelSetProductAggregateSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  channelSet: { type: Schema.Types.String, required: true, ref: MongooseModel.ChannelSet },
  id: { type: String },
  lastSell: { type: Date },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  salePrice: { type: Number },
  thumbnail: { type: String },
  uuid: { type: String },
}).index({ uuid: 1 })
  .index({ channelSet: 1 })
  .index({ lastSell: -1 })
  .index({ quantity: -1 })
  .index({ channelSet: 1, lastSell: -1 })
  .index({ lastSell: -1, quantity: -1 });
