import { Document } from 'mongoose';
import { DomainInterface } from '../interfaces';
import { SubscriptionNetworkModel } from './subscription-network.model';

export interface DomainModel extends DomainInterface, Document {
  _id?: string;
  subscriptionNetwork: SubscriptionNetworkModel | string;
  
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
