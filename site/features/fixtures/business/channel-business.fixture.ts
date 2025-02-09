import { getModelToken } from '@nestjs/mongoose';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ChannelFactory } from '../factories';

class ChannelBusinessFixture extends BaseFixture {
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create(ChannelFactory.create({ type: 'site' }));
  }
}

export = ChannelBusinessFixture;
