import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import {
  BusinessFactory,
  AccessConfigFactory,
  DomainFactory,
  SubscriptionNetworkFactory,
} from './factories';
import {
  AccessConfigModel,
  SubscriptionNetworkModel,
  DomainModel,
} from '../../src/subscriptions/models';
import { BusinessModel } from '@pe/business-kit';
import { SubscriptionNetworkSchemaName } from '../../src/subscriptions/schemas';

const SUBSCRIPTION_NETWORK_ID: string = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class DomainFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly domainModel: Model<DomainModel> = this.application.get('DomainModel');
  private readonly subscriptionNetworkModel: Model<SubscriptionNetworkModel> 
  = this.application.get(getModelToken(SubscriptionNetworkSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.subscriptionNetworkModel.create(SubscriptionNetworkFactory.create({
      _id: SUBSCRIPTION_NETWORK_ID,
      business: BUSINESS_ID,
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      subscriptionNetwork: SUBSCRIPTION_NETWORK_ID,
    }));

    await this.domainModel.create(DomainFactory.create({
      _id: DOMAIN_ID,
      name: 'google.com',

      subscriptionNetwork: SUBSCRIPTION_NETWORK_ID,
    }));
  }
}

export = DomainFixture;
