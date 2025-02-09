import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import {
  BusinessFactory,
  AccessConfigFactory,
  DomainFactory,
  AffiliateBrandingFactory,
} from './factories';
import {
  AccessConfigModel,
  AffiliateBrandingModel,
  DomainModel,
} from '../../src/affiliates/models';
import { BusinessModel } from '@pe/business-kit';
import { AffiliateBrandingSchemaName } from '../../src/affiliates/schemas';

const AFFILIATE_BRANDING_ID: string = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class DomainFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly domainModel: Model<DomainModel> = this.application.get('DomainModel');
  private readonly affiliateBrandingModel: Model<AffiliateBrandingModel> 
  = this.application.get(getModelToken(AffiliateBrandingSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.affiliateBrandingModel.create(AffiliateBrandingFactory.create({
      _id: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      affiliateBranding: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
    }));

    await this.domainModel.create(DomainFactory.create({
      _id: DOMAIN_ID,
      name: 'google.com',

      affiliateBranding: AFFILIATE_BRANDING_ID,
    }));
  }
}

export = DomainFixture;
