import { Document } from 'mongoose';
import { SubscriptionInterface } from '../interfaces/entities';
import { ConnectionPlanModel } from './connection-plan.model';

export interface SubscriptionModel extends SubscriptionInterface, Document {
  _id: any;
  plan: ConnectionPlanModel | string;
}
