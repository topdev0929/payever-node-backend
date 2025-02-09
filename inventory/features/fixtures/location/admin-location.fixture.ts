import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { LocationModel } from '../../../src/inventory/models';
import { LocationFactory } from '../factories';

const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const LOCATION_ID_1: string = 'llllllll-llll-llll-llll-lllllllllll1';
const LOCATION_ID_2: string = 'llllllll-llll-llll-llll-lllllllllll2';


class AdminLocationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly locationModel: Model<LocationModel> = this.application.get('LocationModel');

  public async apply(): Promise<void> {
    const b1=await this.businessModel.create({
      _id: BUSINESS_ID_1,
      id: BUSINESS_ID_1,
      name: 'Test business 1',
      companyAddress: { },
      companyDetails: { },
      contactDetails: { }
    } as any);

    await this.businessModel.create({
      _id: BUSINESS_ID_2,
      id: BUSINESS_ID_2,
      name: 'Test business 2',
      companyAddress: { },
      companyDetails: { },
      contactDetails: { }
    } as any);
    
    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_1,
      id: LOCATION_ID_1,
      businessId: BUSINESS_ID_1,
      name: 'name-1',
      streetName: 'street-1',
      streetNumber: '1',
      city: 'city-1',
      stateProvinceCode: 'code',
      zipCode: '123456',
      countryCode: '+1'
    }));
   
    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_2,
      id: LOCATION_ID_2,
      businessId: BUSINESS_ID_2,
      name: 'name-2',
      streetName: 'street-2',
      streetNumber: '2',
      city: 'city-2',
      stateProvinceCode: 'code',
      zipCode: '223456',
      countryCode: '+2'
    }));
  }
  
}

export = AdminLocationFixture;
