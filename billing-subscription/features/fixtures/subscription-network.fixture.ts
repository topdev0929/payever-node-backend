import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AccessConfigModel, SubscriptionNetworkModel } from '../../src/subscriptions/models';
import { AccessConfigFactory, SubscriptionNetworkFactory } from './factories';
import { SubscriptionNetworkSchemaName } from '../../src/subscriptions/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_BRANDING_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac';

class SubscriptionNetworkFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly subscriptionNetworkModel: Model<SubscriptionNetworkModel> 
    = this.application.get(getModelToken(SubscriptionNetworkSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.subscriptionNetworkModel.create(SubscriptionNetworkFactory.create({
      _id: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
      name: 'Test Branding',
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      internalDomain: 'evgen8',
      isLive: true,
      ownDomain: 'google.com',
      subscriptionNetwork: AFFILIATE_BRANDING_ID,
    }));
  }
}

export = SubscriptionNetworkFixture;



