import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory } from '../factories';
import { BusinessModel } from '../../../src/sites/models';
import { BusinessSchemaName } from '@pe/business-kit';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateFirstSiteFixture extends BaseFixture{
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({}));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      channel: channel._id,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));
  }
}

export = CreateFirstSiteFixture;
