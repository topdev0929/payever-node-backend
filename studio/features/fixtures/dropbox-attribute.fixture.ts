import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AttributeModel } from '../../src/studio/models';
import { AttributeSchemaName } from '../../src/studio/schemas';

const ATTRIBUTE_ID_5: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d91';
const ATTRIBUTE_ID_6: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d92';

class AttributeFixture extends BaseFixture {
  private readonly attributeModel: Model<AttributeModel> = this.application.get(getModelToken(AttributeSchemaName));

  public async apply(): Promise<void> {
    const attributes: any[] = [
      {
        '_id': ATTRIBUTE_ID_5,
        'icon': 'http://test.com/mouse.jpg',
        'name': 'size',
        'type': 'dropbox',
        'createdAt': '2020-01-01T00:00:04.000Z',
        'updatedAt': '2020-01-01T00:00:04.000Z',
      },
      {
        '_id': ATTRIBUTE_ID_6,
        'icon': 'http://test.com/mouse.jpg',
        'name': 'color',
        'type': 'dropbox',
        'createdAt': '2020-01-01T00:00:04.000Z',
        'updatedAt': '2020-01-01T00:00:04.000Z',
      },
    ];

    await this.attributeModel.create(attributes);
  }
}

export = AttributeFixture;
