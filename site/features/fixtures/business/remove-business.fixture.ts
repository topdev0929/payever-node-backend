import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { Model } from 'mongoose';
import { ChannelFactory, ChannelSetFactory, SiteFactory, BusinessFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';


const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class UpdateSiteFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({}));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create(channel));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [channelSet.id],
      name: 'test',
    }));
  }
}

export = UpdateSiteFixture;
