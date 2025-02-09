import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';

class ChannelFixture extends BaseFixture {
  private readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create({
      _id: '973b9295-45cf-4195-b338-c9114cc7b9c1',
      createdAt: new Date(),
      enabled: true,
      enabledByDefault: false,
      type: 'finance_express',
      updatedAt: new Date(),
    });
  }
}

export = ChannelFixture;
