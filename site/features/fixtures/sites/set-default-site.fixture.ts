import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, SiteAccessConfigFactory, SiteFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';
import { SiteDocument, SiteAccessConfigSchemaName, SiteSchemaName } from '../../../src/sites/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SITE_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const CHANNEL_SET_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const DEFAULT_SITE_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

class SetDefaultSiteFixture extends BaseFixture{

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

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SITE_ID,
      businessId: BUSINESS_ID,
      channelSet: channelSet._id,
      name: 'Test update',
      isDefault: false,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: DEFAULT_SITE_ID,
      businessId: BUSINESS_ID,
      channelSet: channelSet._id,
      name: 'Default Site',
      isDefault: true,
    }));
  }
}

export = SetDefaultSiteFixture;
