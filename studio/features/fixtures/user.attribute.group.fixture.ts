import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserAttributeGroupModel } from '../../src/studio/models';
import { UserAttributeGroupSchemaName } from '../../src/studio/schemas';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';
const USER_ATTRIBUTE_GROUP_ID_1: string = '71b50c01-129d-406b-b8b4-f82c3b95b4f4';

class UserAttributeGroupFixture extends BaseFixture {
  private readonly userUserAttributeGroupModel: Model<UserAttributeGroupModel>
    = this.application.get(getModelToken(UserAttributeGroupSchemaName));

  public async apply(): Promise<void> {
    const userUserAttributeGroups: any[] = [
      {
        '_id': USER_ATTRIBUTE_GROUP_ID_1,
        'businessId': BUSINESS_ID,
        'name': 'image detail',
      },
    ];

    await this.userUserAttributeGroupModel.create(userUserAttributeGroups);
  }
}

export = UserAttributeGroupFixture;
