import { SubscriptionPlanInterface } from './subscription-plan.interface';

/**
 * @aka Program
 */
export interface SubscriptionPlansGroupInterface {
  plans: SubscriptionPlanInterface[] | string[];
  name: string;
}
