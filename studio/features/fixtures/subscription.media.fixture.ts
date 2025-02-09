import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionMediaModel } from '../../src/studio/models';
import { SubscriptionMediaSchemaName } from '../../src/studio/schemas/subscription-media.schema';

const ATTRIBUTE_ID_1: string = '64a19c1b-4ea0-4675-aafb-f50c2e3ab12d';
const ATTRIBUTE_ID_2: string = '6a54f9a7-afa8-46a0-a782-1b2d29cc943c';
const ATTRIBUTE_ID_3: string = '5358b71e-f945-4ed3-bba4-13e56ac70184';
const ATTRIBUTE_ID_4: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d9b';

class SubscriptionMediaFixture extends BaseFixture {
  private readonly subscriptionMediaModel: Model<SubscriptionMediaModel> = this.application.get(getModelToken(SubscriptionMediaSchemaName));

  public async apply(): Promise<void> {
    const subscriptionMedia: any[] = [
      {
        "_id": "7d2a9404-e07a-477f-839d-71f591cf1317",
        "url": "https://example.com/free-1.png",
        "mediaType": "image",
        "name": "image 1",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_1,
          'value': 'test1',
        }],
        "subscriptionType": 0,
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
      },
      {
        "url": "https://example.com/essential-2.png",
        "mediaType": "image",
        "name": "image 2",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_1,
          'value': 'test1',
        }],
        "subscriptionType": 1,
        "createdAt": "2020-01-02T00:00:00.000Z",
        "updatedAt": "2020-01-02T00:00:00.000Z",
      },
      {
        "url": "https://example.com/premium-3.png",
        "mediaType": "image",
        "name": "image 3",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_2,
          'value': 'test2',
        }],
        "subscriptionType": 2,
        "createdAt": "2020-01-03T00:00:00.000Z",
        "updatedAt": "2020-01-03T00:00:00.000Z",
      },
      {
        "url": "https://example.com/pro-4.png",
        "mediaType": "image",
        "name": "image 4",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_2,
          'value': 'test2',
        }],
        "subscriptionType": 4,
        "createdAt": "2020-01-04T00:00:00.000Z",
        "updatedAt": "2020-01-04T00:00:00.000Z",
      },
      {
        "url": "https://video.com/free-5.flv",
        "mediaType": "video",
        "name": "video 1",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_3,
          'value': 'test3',
        }],
        "subscriptionType": 0,
        "createdAt": "2020-01-05T00:00:00.000Z",
        "updatedAt": "2020-01-05T00:00:00.000Z",
      },
      {
        "url": "https://video.com/essential-6.flv",
        "mediaType": "video",
        "name": "video 2",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_3,
          'value': 'test3',
        }],
        "subscriptionType": 1,
        "createdAt": "2020-01-06T00:00:00.000Z",
        "updatedAt": "2020-01-06T00:00:00.000Z",
      },
      {
        "url": "https://video.com/premium-7.flv",
        "mediaType": "video",
        "name": "video 3",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_4,
          'value': 'test4',
        }],
        "subscriptionType": 2,
        "createdAt": "2020-01-07T00:00:00.000Z",
        "updatedAt": "2020-01-07T00:00:00.000Z",
      },
      {
        "url": "https://video.com/pro-8.flv",
        "mediaType": "video",
        "name": "video 4",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_4,
          'value': 'test4',
        }],
        "subscriptionType": 4,
        "createdAt": "2020-01-08T00:00:00.000Z",
        "updatedAt": "2020-01-08T00:00:00.000Z",
      },
    ]
    await this.subscriptionMediaModel.create(subscriptionMedia);
  }
}

export = SubscriptionMediaFixture;
