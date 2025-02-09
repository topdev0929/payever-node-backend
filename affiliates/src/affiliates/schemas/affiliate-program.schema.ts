import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { Schema } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';
import { v4 as uuid } from 'uuid';
import { AffiliateContactSchema, AffiliateCommissionSchema, AffiliateBrandingSchemaName } from '.';
import { AffiliateStatusEnum, AppliesToEnum, CommissionTypeEnum } from '../enums';
import { ProductSchemaName } from './product.schema';

export const AffiliateProgramSchemaName: string = 'AffiliateProgram';
export const AffiliateProgramSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    affiliateBranding: { ref: AffiliateBrandingSchemaName, type: String }, 
    affiliates: [AffiliateContactSchema],
    appliesTo: {
      enum: AppliesToEnum,
      type: String,
    },
    assets: Number,
    business: { index: true, ref: BusinessSchemaName, required: true, type: String },
    categories: [{ 
      type: String,
    }],
    channelSets: [{ 
      ref: ChannelSetSchemaName,
      type: String,
    }],
    clicks: Number,
    commission: [AffiliateCommissionSchema],
    commissionType: {
      default: CommissionTypeEnum.Percentage,
      required: true,
      type: CommissionTypeEnum,
    },
    cookie: Number,
    currency: String,
    defaultCommission: Number,
    inviteLink: String,
    name: String,
    products: [{ ref: ProductSchemaName, type: String }],
    programApi: String,
    startedAt: Date,
    status: {
      default: AffiliateStatusEnum.UNACTIVE,
      required: true,
      type: AffiliateStatusEnum,
    },
    url: String,
  },
  {
    collection: 'affiliates',
    timestamps: { },
  },
);

