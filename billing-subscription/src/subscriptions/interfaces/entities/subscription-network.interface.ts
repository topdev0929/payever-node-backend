import { BusinessInterface } from '@pe/business-kit';

export interface SubscriptionNetworkInterface {
  favicon: string;
  logo: string;
  name: string;
  business: BusinessInterface | string;
  isDefault: boolean;
}
