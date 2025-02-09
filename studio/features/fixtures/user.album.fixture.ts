import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserAlbumModel } from '../../src/studio/models';
import { UserAlbumSchemaName } from '../../src/studio/schemas';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';
const ALBUM_ID_1_LVL0: string = '0ebb5ea6-61de-46f7-833f-599018b7861f'
const ALBUM_ID_1_LVL1: string = '256fa624-6f5d-40a1-94a6-d50fe913f653'
const ALBUM_ID_1_LVL2: string = 'a03687bb-e7b0-434d-b871-0a7bdecd5c6e'
const ALBUM_ID_2_LVL0: string = 'eb5913c8-6c81-49ae-a16d-9e89299dee5b'
const ALBUM_ID_2_LVL1: string = 'bf9d575e-e954-4330-880a-4ba3569aebd5'
const ALBUM_ID_2_LVL2: string = '2841aa89-5f34-4df2-a20e-aa3ebfbecad6'
const DATE: string = '2020-01-01T00:00:00.000Z';
const DATE2: string = '2020-01-02T00:00:00.000Z';
const USER_ATTRIBUTE_ID_1: string = '17526ce8-94d3-4dab-99cd-667997bfa356';
const USER_ATTRIBUTE_ID_2: string = '541e9ae1-3119-4e0a-a34b-b37d662996b1';

class UserAlbumFixture extends BaseFixture {
  private readonly userAlbumModel: Model<UserAlbumModel> =
    this.application.get(getModelToken(UserAlbumSchemaName));

  public async apply(): Promise<void> {
    const userAlbum: any[] = [
      {
        '_id': ALBUM_ID_1_LVL0,
        'ancestors': [],
        'businessId': BUSINESS_ID,
        'createdAt': DATE,
        'description': 'some description',
        'name': 'album 1 level 0',
        'updatedAt': DATE,
        'userAttributes': [
          {
            'attribute': USER_ATTRIBUTE_ID_1,
            'value': 'ford',
          },{
            'attribute': USER_ATTRIBUTE_ID_2,
            'value': 'honda',
          },
        ],
      },
      {
        '_id': ALBUM_ID_1_LVL1,
        'ancestors': [ALBUM_ID_1_LVL0],
        'businessId': BUSINESS_ID,
        'createdAt': DATE,
        'description': 'some child description',
        'name': 'album 1 level 1',
        'parent': ALBUM_ID_1_LVL0,
        'updatedAt': DATE,
      },
      {
        '_id': ALBUM_ID_1_LVL2,
        'ancestors': [ALBUM_ID_1_LVL0, ALBUM_ID_1_LVL1],
        'businessId': BUSINESS_ID,
        'createdAt': DATE,
        'name': 'album 1 level 2',
        'parent': ALBUM_ID_1_LVL1,
        'updatedAt': DATE,
      },
      {
        '_id': ALBUM_ID_2_LVL0,
        'ancestors': [],
        'businessId': BUSINESS_ID,
        'createdAt': DATE2,
        'name': 'album 2 level 0',
        'updatedAt': DATE2,
      },
      {
        '_id': ALBUM_ID_2_LVL1,
        'ancestors': [ALBUM_ID_2_LVL0],
        'businessId': BUSINESS_ID,
        'createdAt': DATE2,
        'name': 'album 2 level 1',
        'parent': ALBUM_ID_2_LVL0,
        'updatedAt': DATE2,
      },
      {
        '_id': ALBUM_ID_2_LVL2,
        'ancestors': [ALBUM_ID_2_LVL0, ALBUM_ID_2_LVL1],
        'businessId': BUSINESS_ID,
        'createdAt': DATE2,
        'name': 'album 2 level 2',
        'parent': ALBUM_ID_2_LVL1,
        'updatedAt': DATE2,
      },
    ];

    await this.userAlbumModel.create(userAlbum);
  }
}

export = UserAlbumFixture;
