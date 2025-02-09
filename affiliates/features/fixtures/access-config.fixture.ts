import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import {
  BusinessFactory,
  AccessConfigFactory,
  DomainFactory,
} from './factories';
import {
  AccessConfigModel,
  DomainModel,
  AffiliateBrandingModel,
} from '../../src/affiliates/models';
import { BusinessModel } from '@pe/business-kit';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const AffiliateBranding_ID_1: string = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
const AffiliateBranding_ID_2: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

class DomainFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly domainModel: Model<DomainModel> = this.application.get('DomainModel');
  private readonly affiliateBrandingModel: Model<AffiliateBrandingModel> = 
  this.application.get('AffiliateBrandingModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      affiliateBranding: AffiliateBranding_ID_1,
      business: BUSINESS_ID,
      internalDomain: 'evgen8',
      isLive: true,
      ownDomain: 'google.com',
    }));

    await this.domainModel.create(DomainFactory.create({
      _id: DOMAIN_ID,
      name: 'domainTwo.com',

      affiliateBranding: AffiliateBranding_ID_1,
    }));

    await this.affiliateBrandingModel.create({
      _id: AffiliateBranding_ID_1,
      business: BUSINESS_ID,
      channelSets: [],
      commission: [],
      isDefault: true,
      products: [],
    } as any);

    await this.affiliateBrandingModel.create({
      _id: AffiliateBranding_ID_2,
      business: BUSINESS_ID,
      channelSets: [],
      commission: [],
      isDefault: false,
      products: [],
    } as any);
  }
}

export = DomainFixture;
