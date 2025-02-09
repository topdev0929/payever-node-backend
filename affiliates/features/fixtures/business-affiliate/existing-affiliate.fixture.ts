import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AffiliateModel } from '../../../src/affiliates/models';
import { AffiliateFactory } from '../factories';
import { AffiliateSchemaName } from '../../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const AFFILIATE_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_EMAIL: string = 'affiliate@test.com';

class ExistingAffiliateFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateModel: Model<AffiliateModel> = this.application.get(getModelToken(AffiliateSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    });

    await this.affiliateModel.create(AffiliateFactory.create({
      _id: AFFILIATE_ID,
      email: AFFILIATE_EMAIL,
    }));
  }
}

export = ExistingAffiliateFixture;



