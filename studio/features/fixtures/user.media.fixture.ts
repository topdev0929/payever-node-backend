import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserMediaModel } from '../../src/studio/models';
import { UserMediaSchemaName } from '../../src/studio/schemas/user-media.schema';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';
const ALBUM_ID_1_LVL0: string = '0ebb5ea6-61de-46f7-833f-599018b7861f'
const ATTRIBUTE_ID_1: string = '64a19c1b-4ea0-4675-aafb-f50c2e3ab12d';
const USER_ATTRIBUTE_ID_1: string = '17526ce8-94d3-4dab-99cd-667997bfa356';
const USER_ATTRIBUTE_ID_2: string = '541e9ae1-3119-4e0a-a34b-b37d662996b1';

const SAMPLE_BUSINESS_ID: string = '78f54add-6317-4899-816f-a7fbc70f460b';

class UserMediaFixture extends BaseFixture {
  private readonly userMediaModel: Model<UserMediaModel> = this.application.get(getModelToken(UserMediaSchemaName));

  public async apply(): Promise<void> {
    const userMedia: any[] = [
      {
        '_id': '7d2a9404-e07a-477f-839d-71f591cf1317',
        'url': 'https://example.com/free-1.png',
        'mediaType': 'image',
        'name': 'image 1',
        'businessId': BUSINESS_ID,
        'album': ALBUM_ID_1_LVL0,
        'attributes': [{
          'attribute': ATTRIBUTE_ID_1,
          'value': 'ford2'
        }],
        'userAttributes': [{
          'attribute': USER_ATTRIBUTE_ID_1,
          'value': 'ford'
        },{
          'attribute': USER_ATTRIBUTE_ID_2,
          'value': 'honda'
        }],
        'createdAt': '2020-01-01T00:00:01.000Z',
        'updatedAt': '2020-01-01T00:00:01.000Z',
      },
      {
        '_id': 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'url': 'https://example.com/essential-2.png',
        'mediaType': 'image',
        'name': 'image 2',
        'businessId': BUSINESS_ID,
        'createdAt': '2020-01-02T00:00:02.000Z',
        'updatedAt': '2020-01-02T00:00:02.000Z',
      },
      {
        'url': 'https://example.com/premium-3.png',
        'mediaType': 'image',
        'name': 'image 3',
        'businessId': BUSINESS_ID,
        'createdAt': '2020-01-03T00:00:03.000Z',
        'updatedAt': '2020-01-03T00:00:03.000Z',
      },
      {
        'url': 'https://example.com/pro-4.png',
        'mediaType': 'image',
        'name': 'image 4',
        'businessId': BUSINESS_ID,
        'album': ALBUM_ID_1_LVL0,
        'createdAt': '2020-01-04T00:00:04.000Z',
        'updatedAt': '2020-01-04T00:00:04.000Z',
      },
      {
        'url': 'https://video.com/free-5.flv',
        'mediaType': 'video',
        'name': 'video 1',
        'businessId': BUSINESS_ID,
        'createdAt': '2020-01-05T00:00:05.000Z',
        'updatedAt': '2020-01-05T00:00:05.000Z',
      },
      {
        'url': 'https://video.com/essential-6.flv',
        'mediaType': 'video',
        'name': 'video 2',
        'businessId': BUSINESS_ID,
        'createdAt': '2020-01-06T00:00:06.000Z',
        'updatedAt': '2020-01-06T00:00:06.000Z',
      },
      {
        'url': 'https://video.com/premium-7.flv',
        'mediaType': 'video',
        'name': 'video 3',
        'businessId': BUSINESS_ID,
        'album': ALBUM_ID_1_LVL0,
        'createdAt': '2020-01-07T00:00:07.000Z',
        'updatedAt': '2020-01-07T00:00:07.000Z',
      },
      {
        'url': 'https://video.com/pro-8.flv',
        'mediaType': 'video',
        'name': 'video 4',
        'businessId': BUSINESS_ID,
        'createdAt': '2020-01-08T00:00:08.000Z',
        'updatedAt': '2020-01-08T00:00:08.000Z',
      },
      {
        'url': 'https://image.com/sample.jpg',
        'mediaType': 'image',
        "name": "sample image",
        'businessId': SAMPLE_BUSINESS_ID,
        'example': true,
        'createdAt': '2020-01-08T00:00:08.000Z',
        'updatedAt': '2020-01-08T00:00:08.000Z',
      },
      {
        'url': 'https://video.com/sample.flv',
        'mediaType': 'video',
        "name": "sample video",
        'businessId': SAMPLE_BUSINESS_ID,
        'example': true,
        'createdAt': '2020-01-08T00:00:08.000Z',
        'updatedAt': '2020-01-08T00:00:08.000Z',
      },
    ];

    await this.userMediaModel.create(userMedia);
  }
}

export = UserMediaFixture;
