import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CampaignModel } from '../../../src/modules/campaign/models';
import { CampaignSchemaName } from '../../../src/modules/mongoose-schema/mongoose-schema.names';
import { CampaignFactory } from '../factories';
import { BUSINESS_ID } from '../mail/mail.fixture.base';
import { CAMPAIGN_ID } from './constants';

const CHANNEL_SET_ID: string = 'c07adfb6-8d2e-410c-8a99-4e8b0feb4aad';

class CampaignFixture extends BaseFixture {
  protected readonly campaignModel: Model<CampaignModel> = this.application.get(getModelToken(CampaignSchemaName));

  public async apply(): Promise<void> {
    await this.campaignModel.create(CampaignFactory.create({
      _id: CAMPAIGN_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'campaign test',
    }));
  }
}

export = CampaignFixture;
