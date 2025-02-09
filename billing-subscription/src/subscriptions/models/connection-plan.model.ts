import { Document } from 'mongoose';
import { ConnectionPlanInterface } from '../interfaces/entities';
import { SubscriptionPlanModel } from '.';
import { BusinessModel } from '../../business/interfaces';
import { ConnectionModel } from '../../integrations/models/connection.model';

export interface ConnectionPlanModel extends ConnectionPlanInterface, Document {
  _id: string;
  business?: BusinessModel;
  connection: ConnectionModel;
  subscriptionPlan: SubscriptionPlanModel;
}
