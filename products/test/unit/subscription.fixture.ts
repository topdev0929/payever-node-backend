import { MarketplaceInterface, SubscriptionInterface } from '../../src/marketplace/interfaces';
import { MarketplaceTypeEnum } from '../../src/marketplace';

export class SubscriptionFixture {
  public businessUuid(): string {
    return '0d55f2b6-4a61-418b-a805-4e433e9d997b';
  }

  public subscriptionId(): string {
    return 'e63c16d1-8047-4dbb-baa3-3ec6d0983f09';
  }

  public connectedSubscription(): any {
    return {
      _id: this.subscriptionId(),
      businessId: this.businessUuid(),
      connected: true,
      installed: true,
      name: 'google_shopping',
    };
  }
}
