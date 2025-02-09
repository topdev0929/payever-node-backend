import { Document } from 'mongoose';
import { CustomerPlanModel } from './customer-plan.model';
import { SubscribersGroupInterface } from '../interfaces/entities';

export interface SubscribersGroupModel extends Document, SubscribersGroupInterface {
  _id: string;
  subscribers: CustomerPlanModel[];
}
