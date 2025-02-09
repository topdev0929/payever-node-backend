import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AffiliateSchemaName: string = 'Affiliate';
export const AffiliateSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    email: String,
    firstName: String,
    lastName: String,
  },
  {
    collection: 'affiliate_old',
    timestamps: { },
  },
)
  .index({ email: 1 }, { unique: true })
  ;

