import { MarketplaceTypeEnum } from '../enums';
import { SubscriptionInterface } from './subscription.interface';

export interface MarketplaceInterface {
  businessId: string;
  type: MarketplaceTypeEnum;
  name?: string;
  subscription?: SubscriptionInterface;
}
