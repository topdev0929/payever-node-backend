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
      checkout: '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054',
      type: 'magento',
    } as any);

    await this.model.create({
      _id: '00019b2d-1340-404f-8152-ab126428ae79',
      checkout: '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054',
      type: 'shopware',
    } as any);
  }
}

export = ChannelSetsFixture;
