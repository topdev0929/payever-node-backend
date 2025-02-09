import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { BusinessPaymentsModel, AffiliateBankModel } from '../../src/affiliates/models';
import { BusinessPaymentsFactory, AffiliateBankFactory } from './factories';
import { BusinessPaymentsSchemaName, AffiliateBankSchemaName } from '../../src/affiliates/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const AFFILIATE_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_Bank_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab';
const AFFILIATE_Bank_ID_TWO: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae';
const BUSINESS_PAYMENTS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad';

class BusinessPaymentsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly affiliateBankModel: Model<AffiliateBankModel> 
    = this.application.get(getModelToken(AffiliateBankSchemaName));
    private readonly BusinessPaymentsModel: Model<BusinessPaymentsModel> 
      = this.application.get(getModelToken(BusinessPaymentsSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.affiliateBankModel.create(AffiliateBankFactory.create({
      _id: AFFILIATE_Bank_ID,
      business: BUSINESS_ID,
    }));

    await this.affiliateBankModel.create(AffiliateBankFactory.create({
      _id: AFFILIATE_Bank_ID_TWO,
      business: BUSINESS_ID,
    }));

    await this.BusinessPaymentsModel.create(BusinessPaymentsFactory.create({
      _id: BUSINESS_PAYMENTS_ID,
      business: BUSINESS_ID,
      payments: [AFFILIATE_Bank_ID],
    }));
  }
}

export = BusinessPaymentsFixture;



