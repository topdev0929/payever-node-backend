import { CustomerPlanInterface } from './customer-plan.interface';

export interface SubscribersGroupInterface {
  subscribers: CustomerPlanInterface[] | string[];
  name: string;
}
