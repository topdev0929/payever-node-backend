import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SubscriptionModel } from '../../src/marketplace/models';
import { SubscriptionSchemaName } from '../../src/marketplace';
import { getModelToken } from '@nestjs/mongoose';

class SubcriptionsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<SubscriptionModel> = this.application.get(getModelToken(SubscriptionSchemaName));
    const at: string = '2019-06-19T14:00:00.000Z';

    await model.create({
      _id: '4764806c-c417-11e9-968a-6f455a984530',
      businessId: '21f4947e-929a-11e9-bb05-7200004fe4c0',
      connected: true,
      createdAt: at,
      installed: true,
      name: 'google_shopping',
      updatedAt: at,
    });

    await model.create({
      _id: 'd9042e14-c417-11e9-81b6-e783c52d926a',
      businessId: '21f4947e-929a-11e9-bb05-7200004fe4c0',
      connected: true,
      createdAt: at,
      installed: false,
      name: 'amazon',
      updatedAt: at,
    });

    await model.create({
      _id: 'e46644e0-c417-11e9-8588-73ae0be66cf6',
      businessId: '21f4947e-929a-11e9-bb05-7200004fe4c0',
      connected: false,
      createdAt: at,
      installed: true,
      name: 'ebay',
      updatedAt: at,
    });
  }
}

export = SubcriptionsFixture;
