import { ChannelSetInterface } from '@pe/channels-sdk';
import { AppliedToEnum, BillingIntervalsEnum, PlanTypeEnum, SubscriberEligibilityEnum } from '../../enums';
import { BusinessInterface } from '../../../business';
import { ProductInterface } from './product.interface';
import { CustomerPlanInterface } from './customer-plan.interface';
import { SubscriptionNetworkInterface } from './subscription-network.interface';
import { SubscribersGroupInterface } from './subscribers-group.interface';
import { CategoryInterface } from './category.interface';

export interface SubscriptionPlanInterface {
  appliesTo: AppliedToEnum;
  products: ProductInterface[] | string[];
  categories: CategoryInterface[] | string[];
  subscribersEligibility: SubscriberEligibilityEnum;
  subscribers: CustomerPlanInterface[] | string[];
  subscribersGroups: SubscribersGroupInterface[] | string[];
  business?: BusinessInterface;
  businessId: string;
  name: string;
  planType: PlanTypeEnum;
  interval: BillingIntervalsEnum;
  channelSet: ChannelSetInterface;
  subscribedChannelSets: ChannelSetInterface[];
  subcriptionNetwork: SubscriptionNetworkInterface | string;
  billingPeriod: number;
  shortName?: string;
  totalPrice?: number;
  theme: string;
  subscribersTotals?: number;
  isDefault?: boolean;
}
