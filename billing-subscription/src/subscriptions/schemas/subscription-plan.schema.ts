import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { AppliedToEnum, BillingIntervalsEnum, PlanTypeEnum, SubscriberEligibilityEnum } from '../enums';
import { BusinessSchemaName } from '../../business';
import { ProductSchemaName } from './product.schema';
import { PlanCustomerSchemaName } from './customer-plan.schema';
import { SubscriptionNetworkSchemaName } from './subscription-network.schema';
import { CategorySchemaName } from './category.schema';
import { SubscribersGroupSchemaName } from './subscribers-group.schema';

export const SubscriptionPlanSchemaName: string = 'SubscriptionPlan';

export const SubscriptionPlanSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    appliesTo: {
      default: AppliedToEnum.ALL_PRODUCTS,
      enum: [AppliedToEnum.ALL_PRODUCTS, AppliedToEnum.SPECIFIC_CATEGORIES, AppliedToEnum.SPECIFIC_PRODUCTS],
      required: true,
      type: String,
    },
    billingPeriod: { type: Number, default: 1 },
    businessId: { type: String, required: true },
    categories: [{
      ref: CategorySchemaName,
      type: String,
    }],
    channelSet: { ref: ChannelSetSchemaName, type: String },
    interval: { type: String, default: BillingIntervalsEnum.DAY },
    isDefault: { type: Boolean, default: false },
    name: String,
    planType: {
      default: PlanTypeEnum.fixed,
      enum: [PlanTypeEnum.fixed, PlanTypeEnum.perSeat],
      required: true,
      type: String,
    },
    products: [{
      ref: ProductSchemaName,
      type: String,
    }],
    shortName: String,
    subscribedChannelSets: [{ ref: ChannelSetSchemaName, type: String}],
    subscribers: [{
      ref: PlanCustomerSchemaName,
      type: String,
    }],
    subscribersEligibility: {
      default: SubscriberEligibilityEnum.EVERYONE,
      enum: [
        SubscriberEligibilityEnum.EVERYONE, 
        SubscriberEligibilityEnum.SPECIFIC_GROUPS_OF_SUBSCRIBERS, 
        SubscriberEligibilityEnum.SPECIFIC_SUBSCRIBERS,
      ],
      required: true,
      type: String,
    },
    subscribersGroups: [{
      ref: SubscribersGroupSchemaName,
      type: String,
    }],
    subscriptionNetwork: { 
      ref: SubscriptionNetworkSchemaName,
      type: String,
    },
    theme: String,
    totalPrice: Number,
  },
  {
    collection: 'subscription-plans',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

  .index({ businessId: 1 })
  .index({ product: 1 })
  ;

SubscriptionPlanSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
