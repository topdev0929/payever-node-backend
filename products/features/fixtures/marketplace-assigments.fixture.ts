import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { MarketplaceAssigmentModel } from '../../src/marketplace/models';
import { getModelToken } from '@nestjs/mongoose';
import { MarketplaceAssigmentSchemaName } from '../../src/marketplace/schemas';

class MarketplaceAssigmentsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<MarketplaceAssigmentModel> = this.application.get(getModelToken(MarketplaceAssigmentSchemaName));

    await model.create({
      marketplaceId: '25321cee-c416-11e9-9b34-a721acfd92ed',
      productUuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    });

    await model.create({
      marketplaceId: 'e46644e0-c417-11e9-8588-73ae0be66cf6',
      productUuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    });

    await model.create({
      marketplaceId: 'd9042e14-c417-11e9-81b6-e783c52d926a',
      productUuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    });

    await model.create({
      marketplaceId: '3cb28a38-c417-11e9-9cd6-7b7092074ceb',
      productUuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    });

    await model.create({
      marketplaceId: '4764806c-c417-11e9-968a-6f455a984530',
      productUuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    });
  }
}

export = MarketplaceAssigmentsFixture;
