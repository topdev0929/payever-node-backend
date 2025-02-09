import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessMediaModel } from '../../../src/apps/studio-app/models';
import { BusinessMediaSchemaName } from '../../../src/apps/studio-app/schemas';
import { BusinessMediaFactory } from '../factories';
import { BusinessModel } from '../../../src/business/models';
import { MongooseModel } from '../../../src/common/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class BusinessMediaListFixture extends BaseFixture {
  private readonly businessMediaModel: Model<BusinessMediaModel>
    = this.application.get(getModelToken(BusinessMediaSchemaName));
  private readonly business: Model<BusinessModel>
    = this.application.get(getModelToken(MongooseModel.Business));

  public async apply(): Promise<void> {

    await this.business.create({
      _id: BUSINESS_ID,
    });

    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: '00000000-0000-0000-0000-000000000000',
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));

    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: '11111111-1111-1111-1111-111111111111',
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));

    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: '22222222-2222-2222-1111-111111111111',
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));

    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: '33333333-3333-3333-3333-333333333333',
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));
  }
}

export = BusinessMediaListFixture;
