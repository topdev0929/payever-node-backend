import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const CHANNEL_SET_ID_1: string = '11111111-1111-1111-1111-111111111111';
const CHANNEL_SET_ID_2: string = '22222222-2222-2222-2222-222222222222';
const CHANNEL_SET_ID_3: string = '33333333-3333-3333-3333-333333333333';

class ListCollectionsFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      businessId: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID_1, CHANNEL_SET_ID_2],
      name: 'Collection 1',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      activeSince: new Date('2020-04-13 12:16:00 GMT'),
      activeTill: new Date('2020-04-14 00:00:00 GMT'),
      businessId: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID_1],
      name: 'channel Set 1',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      activeSince: new Date('2020-04-13 12:16:00 GMT'),
      activeTill: new Date('2020-04-14 00:00:00 GMT'),
      businessId: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID_2],
      name: 'channel Set 2',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      businessId: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID_1, CHANNEL_SET_ID_2],
      name: 'Collection 2',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      businessId: ANOTHER_BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID_3],
      name: 'Another business collection',
    }));
  }
}

export = ListCollectionsFixture;
