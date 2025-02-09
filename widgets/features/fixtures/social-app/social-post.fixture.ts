import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { MongooseModel } from '../../../src/common/enums';
import { SocialPostModel, SocialPostSchemaName } from "../../../src/apps/social-app";

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class SocialPostFixture extends BaseFixture {
  private readonly SocialPostModel: Model<SocialPostModel>
    = this.application.get(getModelToken(SocialPostSchemaName));
  private readonly business: Model<BusinessModel>
    = this.application.get(getModelToken(MongooseModel.Business));

  public async apply(): Promise<void> {
    await this.business.create({
      _id: BUSINESS_ID,
    });

    await this.SocialPostModel.create({
      _id: '00000000-0000-0000-0000-000000000001',
      businessId: BUSINESS_ID,
      content: 'content 1',
      title: 'title 1',
      type: 'test 1',
    });

    await this.SocialPostModel.create({
      _id: '00000000-0000-0000-0000-000000000002',
      businessId: BUSINESS_ID,
      content: 'content 2',
      title: 'title 2',
      type: 'test 2',
    });
  }
}

export = SocialPostFixture;
