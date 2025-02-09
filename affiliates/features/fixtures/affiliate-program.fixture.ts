import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AffiliateBrandingModel, AffiliateProgramModel } from '../../src/affiliates/models';
import { AffiliateBrandingFactory, AffiliateProgramFactory } from './factories';
import { AffiliateBrandingSchemaName, AffiliateProgramSchemaName } from '../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const AFFILIATE_Program_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaap';
const AFFILIATE_BRANDING_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac';


class AffiliateProgramFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateProgramModel: Model<AffiliateProgramModel> 
    = this.application.get(getModelToken(AffiliateProgramSchemaName));
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
    }));

    await this.affiliateProgramModel.create(AffiliateProgramFactory.create({
      _id: AFFILIATE_Program_ID,
      affiliateBranding: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
      channelSets: [],
      commission: [],
      products: [],
    }));
  }
}

export = AffiliateProgramFixture;
