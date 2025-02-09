import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, SiteAccessConfigFactory, SiteFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';
import { SiteDocument, SiteAccessConfigDocument, SiteAccessConfigSchemaName, SiteSchemaName } from '../../../src/sites/schemas';

const SITE_ID: string = '11111111-1111-1111-1111-111111111111';
const SITE_ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class ByDomainFixture extends BaseFixture {

  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private readonly siteModel: Model<SiteDocument> = this.application.get(getModelToken(SiteSchemaName));
  private readonly siteAcessConfigModel: Model<SiteAccessConfigDocument> = this.application.get(getModelToken(SiteAccessConfigSchemaName));

  public async apply(): Promise<void> {

    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({}));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      channel: channel._id,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [channelSet._id],
    }));

    await this.siteAcessConfigModel.create(SiteAccessConfigFactory.create({
      _id: SITE_ACCESS_CONFIG_ID,
      privatePassword: '123',
      site: SITE_ID,
      isLive: true,
      internalDomain: 'domain123',
      internalDomainPattern: 'domain123',
      ownDomain: 'domain123',
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SITE_ID,
      accessConfig: [SITE_ACCESS_CONFIG_ID],
      businessId: BUSINESS_ID,
      channelSet: channelSet._id,
      isDefault: true,
    }));
  }
}

export = ByDomainFixture;
