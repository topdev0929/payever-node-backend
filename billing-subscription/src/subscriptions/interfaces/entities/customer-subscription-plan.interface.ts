import { CustomerPlanInterface } from './customer-plan.interface';
import { ConnectionPlanInterface } from './connection-plan.interface';
import { SubscribersGroupInterface } from './subscribers-group.interface';
import { SubscriptionPlansGroupInterface } from './subscription-plan-group.interface';

export interface CustomerSubscriptionPlanInterface {
  customer?: CustomerPlanInterface | string;
  plan?: ConnectionPlanInterface | string;
  subscribersGroups?: SubscribersGroupInterface[] | string[];
  plansGroup?: SubscriptionPlansGroupInterface[] | string[];
  transactionId?: string;
  reference: string;
  quantity?: number;
  remoteSubscriptionId?: string;
  trialEnd?: string;
}
