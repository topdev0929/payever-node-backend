import { Schema } from 'mongoose';
import { MarketplaceTypeEnum } from '../enums';
import { SubscriptionSchemaName } from './subscription.schema';
import { v4 as uuid } from 'uuid';

export const MarketplaceSchemaName: string = 'Marketplace';
export const MarketplaceSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    name: String,
    subscription: { type: String, ref: SubscriptionSchemaName },
    type: { type: MarketplaceTypeEnum, required: true },
  },
  {
    timestamps: true,
  },
);


MarketplaceSchema.index({ businessId: 1 });
