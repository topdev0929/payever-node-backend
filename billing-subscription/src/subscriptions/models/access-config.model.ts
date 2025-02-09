import { Document } from 'mongoose';
import { BusinessModel } from '../../business';
import { AccessConfigInterface } from '../interfaces';
import { SubscriptionNetworkModel } from './subscription-network.model';

export interface AccessConfigModel extends AccessConfigInterface, Document {
  _id?: string;
  business?: BusinessModel | string;
  subscriptionNetwork: SubscriptionNetworkModel | string;
}
