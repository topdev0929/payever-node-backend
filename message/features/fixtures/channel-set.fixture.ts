import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel } from '@pe/channels-sdk';

class ChannelSetFixture extends BaseFixture {
  protected readonly channelModel: Model<ChannelModel> = this.application.get(`ChannelModel`);

  public async apply(): Promise<void> {
    await this.channelModel.create({
      _id: '1f631aeb-1ba7-4517-a133-a3527a028785',
      enabled: true,
      enabledByDefault: false,
      type: 'internal',
    });
  }
}

export = ChannelSetFixture;
