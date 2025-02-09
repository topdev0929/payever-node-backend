import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionMediaModel } from '../../src/studio/models';
import { SubscriptionMediaSchemaName } from '../../src/studio/schemas/subscription-media.schema';

const ATTRIBUTE_ID_5: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d91';
const ATTRIBUTE_ID_6: string = 'a0a82e19-4574-4ffa-82be-e3e5d1e60d92';

class SubscriptionMediaFixture extends BaseFixture {
  private readonly subscriptionMediaModel: Model<SubscriptionMediaModel> = this.application.get(getModelToken(SubscriptionMediaSchemaName));

  public async apply(): Promise<void> {
    const subscriptionMedia: any[] = [
      {
        "url": "https://video.com/dropbox-1.flv",
        "mediaType": "video",
        "name": "video 4",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_6,
          'value': 'red',
        },{
          'attribute': ATTRIBUTE_ID_5,
          'value': 'big',
        }],
        "subscriptionType": 0,
        "createdAt": "2020-01-08T00:00:00.000Z",
        "updatedAt": "2020-01-08T00:00:00.000Z",
      },
      {
        "url": "https://image.com/dropbox-2.jpg",
        "mediaType": "image",
        "name": "dropbox image 1",
        'attributes': [{
          'attribute': ATTRIBUTE_ID_6,
          'value': 'blue',
        },{
          'attribute': ATTRIBUTE_ID_5,
          'value': 'big',
        }],
        "subscriptionType": 0,
        "createdAt": "2020-01-08T00:00:00.000Z",
        "updatedAt": "2020-01-08T00:00:00.000Z",
      },
    ]
    await this.subscriptionMediaModel.create(subscriptionMedia);
  }
}

export = SubscriptionMediaFixture;
