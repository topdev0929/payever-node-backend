import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../../../src/channel-set';
import { ChannelSetSchemaName } from '../../../../../src/mongoose-schema';
import { ChannelSetFactory } from '../../../../fixture-factories/channel-set.factory';

class TestFixture extends BaseFixture {
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const channelSetIdShop: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdShop,
      type: 'shop',
    }) as any);
  }
}

export = TestFixture;
