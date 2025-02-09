import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AffiliateBankModel } from '../../src/affiliates/models';
import { AffiliateBankFactory } from './factories';
import { AffiliateBankSchemaName } from '../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const AFFILIATE_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_Bank_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab';

class AffiliateBankFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateBankModel: Model<AffiliateBankModel> 
    = this.application.get(getModelToken(AffiliateBankSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.affiliateBankModel.create(AffiliateBankFactory.create({
      _id: AFFILIATE_Bank_ID,
      business: BUSINESS_ID,
    }));
  }
}

export = AffiliateBankFixture;



