import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { ChannelSchemaName } from '@pe/channels-sdk';
import { Model } from 'mongoose';
import { channelsFixture } from '../../fixtures/channels.fixture';

class ChannelFixture extends BaseFixture {
  private readonly channelModel: Model<any> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {

    for (const channel of channelsFixture) {
      await this.channelModel.create(channel);
    }
  }
}

export = ChannelFixture;
