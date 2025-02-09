import { Document } from 'mongoose';

import { ChannelSetModel } from '@pe/channels-sdk';

import { PlanTypeEnum } from '../enums';
import { SubscriptionPlanInterface } from '../interfaces/entities';
import { ProductModel } from './product.model';
import { BusinessModel } from '../../business/interfaces';
import { CustomerPlanModel } from './customer-plan.model';
import { SubscriptionNetworkModel } from './subscription-network.model';

export interface SubscriptionPlanModel extends SubscriptionPlanInterface, Document {
  _id: string;
  products: ProductModel[] | string[];
  business?: BusinessModel;
  planType: PlanTypeEnum;
  channelSet: ChannelSetModel;
  subscribedChannelSets: ChannelSetModel[];
  subscribers: CustomerPlanModel[] | string[];
  subscriptionNetwork: SubscriptionNetworkModel | string;
}
