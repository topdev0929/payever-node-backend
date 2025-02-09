import { ConnectionPlanInterface } from './connection-plan.interface';

export interface SubscriptionInterface {
  quantity?: number;
  reference: string;
  remoteSubscriptionId: string;
  plan: ConnectionPlanInterface | string;
  transactionUuid: string;
  userId: string;
  company: string;
  city: string;
  country: string;
  group: string;
  customerEmail: string;
  customerName: string;
  createdAt: Date;
  trialEnd?: Date;
}
