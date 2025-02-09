import { SubscriptionNetworkInterface } from './entities';

export interface DomainInterface {
  name: string;
  isConnected?: boolean;
  subscriptionNetwork: SubscriptionNetworkInterface | string;
}
