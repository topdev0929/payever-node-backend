import { BusinessInterface } from '../../business';
import { SubscriptionNetworkInterface } from './entities';

export interface AccessConfigInterface {
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  isPrivate: boolean;
  ownDomain: string;
  privateMessage: string;
  privatePassword: string;
  socialImage: string;
  isLocked: boolean;
  version?: string;
  business?: BusinessInterface | string;
  businessId: string;
  subscriptionNetwork: SubscriptionNetworkInterface | string;
}
