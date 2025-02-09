import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MarketplaceAssigmentSchemaName: string = 'MarketplaceAssigment';
export const MarketplaceAssigmentSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    marketplaceId: { type: String, required: true },
    productUuid: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

  .index({ productUuid: 1 })
  .index({ marketplaceId: 1 })
  .index({ marketplaceId: 1, productUuid: 1 }, { unique: true })
  ;
