import { Schema } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';
import { v4 as uuid } from 'uuid';

export const AffiliateBankSchemaName: string = 'AffiliateBank';
export const AffiliateBankSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    accountHolder: String,
    accountNumber: String, 
    bankName: String, 
    business: { index: true, ref: BusinessSchemaName, required: true, type: String },
    city: String,  
    country: String,
  },
  {
    timestamps: { },
  },
);

