import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AffiliateModel, BusinessAffiliateModel } from '../../../src/affiliates/models';
import { AffiliateFactory } from '../factories';
import { AffiliateSchemaName, BusinessAffiliateSchemaName } from '../../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const BUSINESS_ID_2: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const AFFILIATE_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_ID_2: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
const BUSINESS_AFFILIATE_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const BUSINESS_AFFILIATE_ID_2: string = 'ffffffff-ffff-ffff-ffff-fffffffffff2';
const AFFILIATE_EMAIL: string = 'affiliate@test.com';
const AFFILIATE_EMAIL_2: string = 'affiliate2@test.com';

class BusinessAffiliateExistsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateModel: Model<AffiliateModel> = this.application.get(getModelToken(AffiliateSchemaName));
  private readonly businessAffiliateModel: Model<BusinessAffiliateModel>
    = this.application.get(getModelToken(BusinessAffiliateSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    });

    await this.businessModel.create({
      _id: BUSINESS_ID_2,
      name: 'Test business 2',
    });

    const affiliate: AffiliateModel = await this.affiliateModel.create(AffiliateFactory.create({
      _id: AFFILIATE_ID,
      email: AFFILIATE_EMAIL,
    }));

    await this.affiliateModel.create(AffiliateFactory.create({
      _id: AFFILIATE_ID_2,
      email: AFFILIATE_EMAIL_2,
    }));

    await this.businessAffiliateModel.create({
      _id: BUSINESS_AFFILIATE_ID,
      affiliate,
      businessId: BUSINESS_ID,
    });

    await this.businessAffiliateModel.create({
      _id: BUSINESS_AFFILIATE_ID_2,
      affiliate,
      businessId: BUSINESS_ID_2,
    });
  }
}

export = BusinessAffiliateExistsFixture;
