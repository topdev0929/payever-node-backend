import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, SiteFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';
import { SiteDocument, SiteSchemaName } from '../../../src/sites/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SHOP_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const CHANNEL_SET_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class DeleteSiteFixture extends BaseFixture {

  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private readonly siteModel: Model<SiteDocument> = this.application.get(getModelToken(SiteSchemaName));

  public async apply(): Promise<void> {
    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({}));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID,
      channel: channel._id,
    }));

    const anotherchannelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      channel: channel._id,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID, anotherchannelSet._id],
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SHOP_ID,
      businessId: BUSINESS_ID,
      name: 'Test update',
      channelSet: CHANNEL_SET_ID as any,
    }));

    await this.siteModel.create(SiteFactory.create({
      businessId: BUSINESS_ID,
      name: 'Another shop',
      channelSet: anotherchannelSet._id,
    }));
  }
}

export = DeleteSiteFixture;
