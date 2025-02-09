import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AttributeModel } from '../../src/studio/models';
import { AttributeSchemaName } from '../../src/studio/schemas';

const ATTRIBUTE_ID_1: string = '64a19c1b-4ea0-4675-aafb-f50c2e3ab12d';
const ATTRIBUTE_ID_2: string = '6a54f9a7-afa8-46a0-a782-1b2d29cc943c';
const ATTRIBUTE_ID_3: string = '5358b71e-f945-4ed3-bba4-13e56ac70184';
const ATTRIBUTE_ID_4: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d9b';

class AttributeFixture extends BaseFixture {
  private readonly attributeModel: Model<AttributeModel> = this.application.get(getModelToken(AttributeSchemaName));

  public async apply(): Promise<void> {
    const attributes: any[] = [
      {
        '_id': ATTRIBUTE_ID_1,
        'icon': 'http://test.com/car.jpg',
        'name': 'car',
        'type': 'vehicle',
        'createdAt': '2020-01-01T00:00:01.000Z',
        'updatedAt': '2020-01-01T00:00:01.000Z',
      },
      {
        '_id': ATTRIBUTE_ID_2,
        'icon': 'http://test.com/motorcycle.jpg',
        'name': 'motorcycle',
        'type': 'vehicle',
        'createdAt': '2020-01-01T00:00:02.000Z',
        'updatedAt': '2020-01-01T00:00:02.000Z',
      },
      {
        '_id': ATTRIBUTE_ID_3,
        'icon': 'http://test.com/cat.jpg',
        'name': 'cat',
        'type': 'animal',
        'createdAt': '2020-01-01T00:00:03.000Z',
        'updatedAt': '2020-01-01T00:00:03.000Z',
      },
      {
        '_id': ATTRIBUTE_ID_4,
        'icon': 'http://test.com/mouse.jpg',
        'name': 'mouse',
        'type': 'animal',
        'createdAt': '2020-01-01T00:00:04.000Z',
        'updatedAt': '2020-01-01T00:00:04.000Z',
      },
    ];

    await this.attributeModel.create(attributes);
  }
}

export = AttributeFixture;
