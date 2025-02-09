import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from './business.schema';
import { ProductSchemaName } from './products.schema';

export const ProductSubscriptionSchemaName: string = 'ProductSubscription';

export const ProductSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    marketplaceProduct: { type: String, ref: ProductSchemaName },
    productId: String,
  },
  {
    collection: 'product-subscriptions',
    timestamps: true,
  },
)

  .index({ productId: 1 })
  .index({ marketplaceProduct: 1, businessId: 1 }, { unique: true })
  .plugin(beautifyUnique)
  ;

ProductSubscriptionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
