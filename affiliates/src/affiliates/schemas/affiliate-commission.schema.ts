import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CommissionTypeEnum } from '../enums';

export const AffiliateCommissionSchemaName: string = 'AffiliateCommission';
export const AffiliateCommissionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    commission: String, 
    commissionType: {
        default: CommissionTypeEnum.Percentage,
        required: true,
        type: CommissionTypeEnum,
    },
    identifier: String,
    title: String,
  },
  {
    timestamps: { },
  },
);

