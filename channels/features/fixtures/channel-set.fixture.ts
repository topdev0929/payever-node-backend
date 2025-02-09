import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { Model } from 'mongoose';

class ChannelSetFixture extends BaseFixture {
  private readonly channelSetModel: Model<any> = this.application.get(getModelToken(ChannelSetSchemaName));

  CHANNEL_SET_ID_BUSINESS_1: string = 'ff2d3a52-9978-4621-bc84-8dc639bedeeb';
  CHANNEL_SET_ID_BUSINESS_2: string = '0359d4c2-016b-4d13-9854-11e0bf542a6b';
  CHANNEL_SET_ID_NOT_LINKED_1: string = '4ac27113-de3b-42d2-a2e7-26a4943cb00a';
  CHANNEL_SET_ID_NOT_LINKED_2: string = '7e3441f7-eef7-4e8a-a2ac-968ea334f776';
  CHANNEL_ID_LINK: string = '4ac27113-de3b-42d2-a2e7-26a4943cb00a';
  CHANNEL_ID_FINANCE_EXPRESS: string = '110eae3b-da92-11e8-b2bf-000d3a4679c7';
  BUSINESS_ID_NEW: string = '2f06da8f-7240-43f0-a078-622730304fcc';
  BUSINESS_ID_EXISTED: string = 'b090e668-90e5-4d9b-9b65-3886c0fcc9d4';

  public async apply(): Promise<void> {
    await this.channelSetModel.create({
      _id: this.CHANNEL_SET_ID_NOT_LINKED_1,
      businessId: this.BUSINESS_ID_NEW,
      channel: this.CHANNEL_ID_LINK,
      type: 'api',
    });

    await this.channelSetModel.create({
      _id: this.CHANNEL_SET_ID_NOT_LINKED_2,
      channel: this.CHANNEL_ID_FINANCE_EXPRESS,
      businessId: this.BUSINESS_ID_NEW,
      type: 'ecommerce',
    });

    await this.channelSetModel.create({
      _id: this.CHANNEL_SET_ID_BUSINESS_1,
      businessId: this.BUSINESS_ID_EXISTED,
      channel: this.CHANNEL_ID_LINK,
      type: 'api',
    });

    await this.channelSetModel.create({
      _id: this.CHANNEL_SET_ID_BUSINESS_2,
      businessId: this.BUSINESS_ID_EXISTED,
      channel: this.CHANNEL_ID_FINANCE_EXPRESS,
      type: 'ecommerce',
    });
  }
}

export = ChannelSetFixture;
