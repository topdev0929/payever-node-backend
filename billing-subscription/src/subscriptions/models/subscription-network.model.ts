import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { SubscriptionNetworkInterface } from '../interfaces/entities';

export interface SubscriptionNetworkModel extends SubscriptionNetworkInterface, Document {
  business: BusinessModel | string;
}
