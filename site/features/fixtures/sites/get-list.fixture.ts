import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, SiteFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';
import { SiteDocument, SiteSchemaName } from '../../../src/sites/schemas';

const SITE_ID_1: string = '11111111-1111-1111-1111-111111111111';
const SITE_ID_2: string = '22222222-2222-2222-2222-222222222222';
const ANOTHER_BUSINESS_SITE_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class GetListFixture extends BaseFixture{

  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private readonly siteModel: Model<SiteDocument> = this.application.get(getModelToken(SiteSchemaName));

  public async apply(): Promise<void> {

    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({}));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      channel: channel._id,
    }));

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [channelSet._id],
    }));

    const anotherBusiness: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
      channelSets: [channelSet._id],
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SITE_ID_1,
      businessId: BUSINESS_ID,
      channelSet: channelSet._id,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SITE_ID_2,
      businessId: BUSINESS_ID,
      channelSet: channelSet._id,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: ANOTHER_BUSINESS_SITE_ID,
      businessId: ANOTHER_BUSINESS_ID,
      channelSet: channelSet._id,
    }));
  }
}

export = GetListFixture;
