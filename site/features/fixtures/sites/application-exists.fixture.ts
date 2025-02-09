import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SiteAccessConfigDocument, DomainSchemaName, SiteAccessConfigSchemaName, SiteSchemaName } from '../../../src/sites/schemas';
import { SiteDocument } from '../../../src/sites/schemas';
import { ChannelSetFactory, DomainFactory, SiteAccessConfigFactory, SiteFactory } from '../factories';
import { ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { DomainModel } from '../../../src/sites/models/domain.model';

const APPLICATION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CHANNELSET_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const DOMAIN_ID: string = 'a8c099a0-35f2-48c6-96cd-17282ad8a062';

class ApplicationExistsFixture extends BaseFixture {
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private siteModel: Model<SiteDocument> = this.application.get(getModelToken(SiteSchemaName));
  private siteAccessConfigDocument: Model<SiteAccessConfigDocument> = this.application.get(getModelToken(SiteAccessConfigSchemaName));
  private domainModel: Model<DomainModel> = this.application.get(getModelToken(DomainSchemaName));

  public async apply(): Promise<void> {
    await this.createSite(
      {
        _id: APPLICATION_ID,
        businessId: BUSINESS_ID as any,
      },
      CHANNELSET_ID,
    );
  }

  private async createSite(sitePrototype: Partial<SiteDocument>, channelId: string): Promise<SiteDocument> {
    const channelSet = await this.channelSetModel.create(ChannelSetFactory.create(
        {
          businessId: sitePrototype.businessId,
          channel: channelId,
        },
      ),
    );

    const site = await this.siteModel.create(SiteFactory.create(
        {
          ...sitePrototype,
          channelSet: channelSet._id,
        },
      ),
    );

    await this.siteAccessConfigDocument.create(SiteAccessConfigFactory.create(
      {
          isLive: true,
          ownDomain: `test.payever.me`,
          site: site._id,
        },
      ),
    );

    await this.domainModel.create(DomainFactory.create(
        {
          _id: DOMAIN_ID,
          site: site._id,
          isConnected: false,
          name: 'test.payever.me',
        }
      )
    );

    return site;
  }
}

export = ApplicationExistsFixture;
