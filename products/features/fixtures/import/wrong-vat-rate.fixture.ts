import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { businessFactory } from '../factories';

class WrongVatRateFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<BusinessModel> = this.application.get('BusinessModel');

    const businessId: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    await model.create(businessFactory({
      _id: businessId,
      companyAddress: {
        country: 'DE',
      },
    }));
  }
}

export = WrongVatRateFixture;
