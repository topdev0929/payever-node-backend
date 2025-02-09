import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, SiteAccessConfigFactory, SiteFactory } from '../factories';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../../src/sites/models';
import { SiteAccessConfigDocument, SiteAccessConfigSchemaName, SiteDocument, SiteSchemaName } from '../../../src/sites/schemas';
import { BUSINESS_1_ID, CHANNEL_1_ID, CHANNEL_SET_1_ID, SITE_1_ID, SITE_ACCESS_CONFIG_1_ID } from '../const';

class PrivateSite extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> =
    this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<ChannelModel> =
    this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> =
    this.application.get(getModelToken(ChannelSetSchemaName));
  private readonly siteModel: Model<SiteDocument> =
    this.application.get(getModelToken(SiteSchemaName));
  private readonly siteAccessConfigModle: Model<SiteAccessConfigDocument> =
    this.application.get(getModelToken(SiteAccessConfigSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_1_ID,
      channelSets: [CHANNEL_SET_1_ID],
    }));

    await this.channelModel.create(ChannelFactory.create({
      _id: CHANNEL_1_ID,
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_1_ID,
      channel: CHANNEL_1_ID,
    }));

    await this.siteModel.create(SiteFactory.create({
      _id: SITE_1_ID,
      accessConfig: [SITE_ACCESS_CONFIG_1_ID],
      businessId: BUSINESS_1_ID,
      channelSet: CHANNEL_SET_1_ID,
      isDefault: true,
      name: 'Private site #1',
    }));

    await this.siteAccessConfigModle.create(SiteAccessConfigFactory.create({
      _id: SITE_ACCESS_CONFIG_1_ID,

      isLive: true,

      isPrivate: true,

      privateMessage: 'private-message',
      privatePassword: 'private-password',

      approvedCustomersAllowed: true,

      internalDomain: 'private-site',
      internalDomainPattern: 'private-site',

      ownDomain: 'private-site',

      site: SITE_1_ID,
    }));
  }
}

export = PrivateSite;
