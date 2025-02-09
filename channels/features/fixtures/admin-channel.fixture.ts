import { getModelToken } from '@nestjs/mongoose';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

const CHANNEL_ID_1: string = 'channel-id-1';
const CHANNEL_ID_2: string = 'channel-id-2';
const CHANNEL_ID_3: string = 'channel-id-3';

class AdminChannelsFixture extends BaseFixture {
  private readonly model: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {

    await this.model.create([
      {
        _id: CHANNEL_ID_1,
        legacyId: 10,
        type: "video",
        enabled: true,
        enabledByDefault: true,
        customPolicy: true
      },
      {
        _id: CHANNEL_ID_2,
        legacyId: 20,
        type: "link",
        enabled: true,
        enabledByDefault: true,
        customPolicy: true
      },
      {
        _id: CHANNEL_ID_3,
        legacyId: 30,
        type: "advertising",
        enabled: true,
        enabledByDefault: true,
        customPolicy: true
      }
    ]);
  }
}

export = AdminChannelsFixture;
