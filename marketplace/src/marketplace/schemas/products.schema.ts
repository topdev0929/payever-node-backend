import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { ProductRating } from './product-rating.schema';
import { BusinessSchemaName } from './business.schema';

export const ProductSchemaName: string = 'Product';

export const ProductSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },
    businessId: { index: true, required: true, type: String },
    channelSet: { type: String, ref: ChannelSetSchemaName },
    country: String,
    currency: String,
    imports: Number,
    price: { index: true, required: true, type: Number },
    rating: ProductRating,
    title: { index: true, required: true, type: String },
    type: { enum: ['digital', 'physical', 'service'], type: String },
  },
  { timestamps: true },
);

ProductSchema.plugin(beautifyUnique);

ProductSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
