import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../src/business';
import { BusinessFactory } from './factories';

class BusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: '_id-of-business',
      currency: 'EUR',
      name: 'test',
    }));
  }
}

export = BusinessFixture;
