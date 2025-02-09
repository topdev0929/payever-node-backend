import { SubscriptionInterface } from '../entities';

export interface ProductConnectionPlanInterface {
  id: string;
  subscriptions: SubscriptionInterface[];
}
