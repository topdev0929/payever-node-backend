import { Document } from 'mongoose';
import { ConnectionPlanModel } from './connection-plan.model';
import { CustomerPlanModel } from './customer-plan.model';
import { SubscriptionPlansGroupModel } from './subscription-plan-group.model';
import { SubscribersGroupModel } from './subscribers-group.model';
import { CustomerSubscriptionPlanInterface } from '../interfaces/entities';

export interface CustomerSubscriptionPlanModel extends CustomerSubscriptionPlanInterface, Document {
  readonly _id: string;
  customer?: CustomerPlanModel | string;
  plan?: ConnectionPlanModel | string;
  subscribersGroups?: SubscribersGroupModel[] | string[];
  plansGroup?: SubscriptionPlansGroupModel[] | string[];
  transactionId?: string;
  reference: string;
  quantity?: number;
  remoteSubscriptionId?: string;
  trialEnd?: string;
}
