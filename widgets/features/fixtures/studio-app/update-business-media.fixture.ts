import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessMediaModel } from '../../../src/studio-app/models';
import { BusinessMediaSchemaName } from '../../../src/studio-app/schemas';
import { BusinessMediaFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const BUSINESS_MEDIA_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class UpdateWidgetFixture extends BaseFixture {
  private readonly businessMediaModel: Model<BusinessMediaModel>
    = this.application.get(getModelToken(BusinessMediaSchemaName));

  public async apply(): Promise<void> {
    await this.businessMediaModel.create(BusinessMediaFactory.create({
      _id: BUSINESS_MEDIA_ID,
      businessId: BUSINESS_ID,
      name: 'some name',
      url: 'some-url',
    }));
  }
}

export = UpdateWidgetFixture;
