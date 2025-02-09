import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { AffiliateSchemaName } from './affiliate.schema';
import { BusinessSchemaName } from '@pe/business-kit';

export const BusinessAffiliateSchemaName: string = 'BusinessAffiliate';
export const BusinessAffiliateSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    affiliate: { type: String, ref: AffiliateSchemaName },
    businessId: { type: String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

BusinessAffiliateSchema.index({ affiliate: 1, businessId: -1 }, { unique: true });

BusinessAffiliateSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
