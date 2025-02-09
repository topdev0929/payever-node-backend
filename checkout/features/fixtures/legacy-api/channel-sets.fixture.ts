import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../src/channel-set';
import { ChannelSetSchemaName } from '../../../src/mongoose-schema';

class ChannelSetsFixture extends BaseFixture {
  private readonly model: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '006388b0-e536-4d71-b1f1-c21a6f1801e6',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      type: 'magento',
    } as any);
    
    await this.model.create({
      _id: '0997aebe-1924-4c29-a221-b2be26f56a15',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      type: 'pos',
    } as any);

    await this.model.create({
      _id: '00019b2d-1340-404f-8152-ab126428ae79',
      checkout: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      type: 'shopware',
    } as any);

    await this.model.create({
      _id: '205811e2-3866-4c93-8515-3b11ac579c8b',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      type: 'api',
    } as any);

    await this.model.create({
      _id: 'b6320c91-043e-4329-b6a2-2b7cf93711b3',
      checkout: '2967ef02-6b10-4717-91d7-90e8fd4df76c',
      type: 'api',
    } as any);
  }
}

export = ChannelSetsFixture;
