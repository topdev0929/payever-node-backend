import { Document } from 'mongoose';
import { SubscriptionPlanModel } from './subscription-plan.model';
import { SubscriptionPlansGroupInterface } from '../interfaces/entities';

export interface SubscriptionPlansGroupModel extends SubscriptionPlansGroupInterface, Document{
  _id: string;
  plans: SubscriptionPlanModel[] | string[];
}
