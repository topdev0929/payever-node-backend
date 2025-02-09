import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { ApplicationModel } from '../../../src/builder/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const APPLICATION_ID: string = 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1';

class ExistApplicationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly applicationModel: Model<ApplicationModel> = this.application.get(getModelToken('Application'));

  public async apply(): Promise<void> {
    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'test',
    }));

    await this.applicationModel.create({
      _id: APPLICATION_ID,
      business: business,
      email: 'email@maol.com',
      name: 'name',
      title: 'title',
    });
  }

}

export = ExistApplicationFixture;
