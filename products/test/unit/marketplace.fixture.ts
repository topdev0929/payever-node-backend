import { MarketplaceTypeEnum } from '../../src/marketplace';

export class MarketplaceFixture {
  public createAt: Date = new Date();

  public businessUuid(): string {
    return '0d55f2b6-4a61-418b-a805-4e433e9d997b';
  }

  public shopMarketplace(): any {
    return {
      _id: '7a4f05c8-c3fa-11e9-9e0c-5fa6b87f7d16',
      businessId: this.businessUuid(),
      name: 'my shop',
      type: MarketplaceTypeEnum.SHOP,
    };
  }
  public integrationMarketplace(): any {
    return {
      businessId: this.businessUuid(),
      name: 'google_shopping',
      subscription: 'e63c16d1-8047-4dbb-baa3-3ec6d0983f09',
      type: MarketplaceTypeEnum.INTEGRATION,
    };
  }
}
