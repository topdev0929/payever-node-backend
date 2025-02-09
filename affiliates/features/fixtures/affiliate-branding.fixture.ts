import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AccessConfigModel, AffiliateBrandingModel } from '../../src/affiliates/models';
import { AccessConfigFactory, AffiliateBrandingFactory } from './factories';
import { AffiliateBrandingSchemaName } from '../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_BRANDING_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac';

class AffiliateBrandingFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly affiliateBrandingModel: Model<AffiliateBrandingModel> 
    = this.application.get(getModelToken(AffiliateBrandingSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.affiliateBrandingModel.create(AffiliateBrandingFactory.create({
      _id: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
      name: 'Test Branding',
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      affiliateBranding: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
      internalDomain: 'evgen8',
      isLive: true,
      ownDomain: 'google.com',
    }));
  }
}

export = AffiliateBrandingFixture;



