import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessMediaModel } from '../../../src/apps/studio-app/models';
import { BusinessMediaSchemaName } from '../../../src/apps/studio-app/schemas';
import { BusinessMediaFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class RemoveBusinessMediaFixture extends BaseFixture {
  private readonly businessMediaModel: Model<BusinessMediaModel>
    = this.application.get(getModelToken(BusinessMediaSchemaName));

  public async apply(): Promise<void> {
    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));
  }
}

export = RemoveBusinessMediaFixture;
