import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserAttributeModel } from '../../src/studio/models';
import { UserAttributeSchemaName } from '../../src/studio/schemas';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';
const USER_ATTRIBUTE_GROUP_ID_1: string = '71b50c01-129d-406b-b8b4-f82c3b95b4f4';
const USER_ATTRIBUTE_ID_1: string = '17526ce8-94d3-4dab-99cd-667997bfa356';
const USER_ATTRIBUTE_ID_2: string = '541e9ae1-3119-4e0a-a34b-b37d662996b1';
const USER_ATTRIBUTE_ID_3: string = 'c0c6d1c3-c6a3-4951-8cb4-7405b21c159d';
const USER_ATTRIBUTE_ID_4: string = '9e50b050-b769-4ad7-869a-929c4d1ddc2b';

class UserAttributeFixture extends BaseFixture {
  private readonly userUserAttributeModel: Model<UserAttributeModel> = this.application.get(getModelToken(UserAttributeSchemaName));

  public async apply(): Promise<void> {
    const userUserAttributes: any[] = [
      {
        '_id': USER_ATTRIBUTE_ID_1,
        'icon': 'http://test.com/car.jpg',
        'name': 'car',
        'type': 'vehicle',
        'showOn': ['all'],
        'defaultValue': 'default',
        'businessId': BUSINESS_ID,
        'userAttributeGroup': USER_ATTRIBUTE_GROUP_ID_1,
        'createdAt': '2020-01-01T00:00:01.000Z',
        'updatedAt': '2020-01-01T00:00:01.000Z',
      },
      {
        '_id': USER_ATTRIBUTE_ID_2,
        'icon': 'http://test.com/motorcycle.jpg',
        'name': 'motorcycle',
        'type': 'vehicle',
        'showOn': ['media'],
        'defaultValue': 'default',
        'businessId': BUSINESS_ID,
        'userAttributeGroup': USER_ATTRIBUTE_GROUP_ID_1,
        'createdAt': '2020-01-01T00:00:02.000Z',
        'updatedAt': '2020-01-01T00:00:02.000Z',
      },
      {
        '_id': USER_ATTRIBUTE_ID_3,
        'icon': 'http://test.com/cat.jpg',
        'name': 'cat',
        'type': 'animal',
        'defaultValue': 'default',
        'businessId': BUSINESS_ID,
        'userAttributeGroup': USER_ATTRIBUTE_GROUP_ID_1,
        'createdAt': '2020-01-01T00:00:03.000Z',
        'updatedAt': '2020-01-01T00:00:03.000Z',
      },
      {
        '_id': USER_ATTRIBUTE_ID_4,
        'icon': 'http://test.com/mouse.jpg',
        'name': 'mouse',
        'type': 'animal',
        'defaultValue': 'default',
        'businessId': BUSINESS_ID,
        'userAttributeGroup': USER_ATTRIBUTE_GROUP_ID_1,
        'createdAt': '2020-01-01T00:00:04.000Z',
        'updatedAt': '2020-01-01T00:00:04.000Z',
      },
    ];

    this.userUserAttributeModel.create(userUserAttributes);
  }
}

export = UserAttributeFixture;
