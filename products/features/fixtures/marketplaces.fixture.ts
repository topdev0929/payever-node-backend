import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { MarketplaceSchemaName, MarketplaceTypeEnum } from '../../src/marketplace';
import { MarketplaceModel } from '../../src/marketplace/models';
import { getModelToken } from '@nestjs/mongoose';

class MarketplacesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<MarketplaceModel> = this.application.get(getModelToken(MarketplaceSchemaName));
    const businessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

    await model.create({
      _id: '25321cee-c416-11e9-9b34-a721acfd92ed',
      businessId: businessId,
      name: 'my shop',
      type: MarketplaceTypeEnum.SHOP,
    });

    await model.create({
      _id: '3cb28a38-c417-11e9-9cd6-7b7092074ceb',
      businessId: businessId,
      name: 'pos',
      type: MarketplaceTypeEnum.POS,
    });

    await model.create({
      _id: '4764806c-c417-11e9-968a-6f455a984530',
      businessId: businessId,
      name: 'google_shopping',
      subscription: '4764806c-c417-11e9-968a-6f455a984530',
      type: MarketplaceTypeEnum.MARKET,
    });

    await model.create({
      _id: 'd9042e14-c417-11e9-81b6-e783c52d926a',
      businessId: businessId,
      name: 'amazon',
      subscription: 'd9042e14-c417-11e9-81b6-e783c52d926a',
      type: MarketplaceTypeEnum.MARKET,
    });

    await model.create({
      _id: 'e46644e0-c417-11e9-8588-73ae0be66cf6',
      businessId: businessId,
      name: 'ebay',
      subscription: 'e46644e0-c417-11e9-8588-73ae0be66cf6',
      type: MarketplaceTypeEnum.MARKET,
    });
  }
}

export = MarketplacesFixture;
