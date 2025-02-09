import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../../../src/channel-set/models';
import { ChannelSetSchemaName } from '../../../../../src/mongoose-schema';

class ChannelSetsFixture extends BaseFixture {
  private readonly model: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '006388b0-e536-4d71-b1f1-c21a6f1801e6',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      type: 'magento',
    } as any);

    await this.model.create({
      _id: '00019b2d-1340-404f-8152-ab126428ae79',
      checkout: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      type: 'shopware',
    } as any);
  }
}

export = ChannelSetsFixture;
