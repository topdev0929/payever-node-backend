import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AffiliateModel, BusinessAffiliateModel } from '../../../src/affiliates/models';
import { AffiliateFactory } from '../factories';
import { AffiliateSchemaName, BusinessAffiliateSchemaName } from '../../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const AFFILIATE_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_AFFILIATE_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const AFFILIATE_EMAIL: string = 'affiliate@test.com';
const ANOTHER_BUSINESS_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class DeleteBusinessAffiliateFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateModel: Model<AffiliateModel> = this.application.get(getModelToken(AffiliateSchemaName));
  private readonly businessAffiliateModel: Model<BusinessAffiliateModel>
    = this.application.get(getModelToken(BusinessAffiliateSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: ANOTHER_BUSINESS_ID,
      name: 'Test another business',
    });

    const business: BusinessModel = await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    });

    const affiliate: AffiliateModel = await this.affiliateModel.create(AffiliateFactory.create({
      _id: AFFILIATE_ID,
      email: AFFILIATE_EMAIL,
    }));

    await this.businessAffiliateModel.create({
      _id: BUSINESS_AFFILIATE_ID,
      affiliate,
      businessId: business._id,
    });
  }
}

export = DeleteBusinessAffiliateFixture;
