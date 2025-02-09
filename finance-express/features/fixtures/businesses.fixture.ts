import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ChannelSetSchemaName } from '@pe/channels-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const CHANNEL_SET_ID: string = '11111111-1111-1111-1111-111111111111';

class CreateWidgetFixture extends BaseFixture {
  private readonly businessModel: Model<any> = this.application.get('BusinessModel');
  private readonly channelSetModel: Model<any> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {

    await this.businessModel.create({
      _id: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID],
    });

    await this.businessModel.create({
      _id: ANOTHER_BUSINESS_ID,
    });


    await this.channelSetModel.create({
      _id: CHANNEL_SET_ID,
      channel: '22222222-2222-2222-2222-222222222222',
    });

  }
}

export = CreateWidgetFixture;
