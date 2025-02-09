import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { LocationModel } from '../../../src/inventory/models';
import { LocationFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class CreateLocationSkuExistsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly locationModel: Model<LocationModel> = this.application.get('LocationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.locationModel.create(LocationFactory.create({
      businessId: BUSINESS_ID,
    }));
  }
}

export = CreateLocationSkuExistsFixture;
