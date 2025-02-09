import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessLocalModel } from '../../src/business/models';
import { BusinessSchemaName } from '../../src/business/schemas';
import { PostModel } from '../../src/social/models';
import { PostFactory } from './factories';
import { PostSchemaName } from '../../src/social/schemas';
import {BUSINESS_ID, POST_ID_1, POST_ID_2, POST_ID_3, POST_ID_4} from './const';


class PostFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessLocalModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly postModel: Model<PostModel>
    = this.application.get(getModelToken(PostSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.postModel.create(PostFactory.create({
      _id: POST_ID_1,
      businessId: BUSINESS_ID,
      title: 'title',
      media: ['media'],
    }));

    await this.postModel.create(PostFactory.create({
      _id: POST_ID_2,
      businessId: BUSINESS_ID,
      postState: [
        {
          error: {
            code: 1,
            error: 'Unsupported Media',
            message: 'png image not supported'
          },
          integrationName:'twitter',
          status:'failed'
        },
        {
          integrationName: 'instagram-posts',
          status: 'succeeded'
        }
      ]
    }));

    await this.postModel.create(PostFactory.create({
      _id: POST_ID_3,
      businessId: BUSINESS_ID,
      attachments: [
        { _id: 'attachments-id-1', contentType: 'pdf', url: 'url' },
      ],
      media:[
        'media-1',
        'media-2',
        'media-3',
      ],
      productId:[
        'product-1',
        'product-2',
        'product-3'
      ],
      postState: [
        {
          error: {
            code: 1,
            error: 'Unsupported Media',
            message: 'png image not supported'
          },
          integrationName:'twitter',
          status:'failed'
        },
        {
          integrationName: 'instagram-posts',
          status: 'succeeded'
        }
      ]
    }));

    await this.postModel.create(PostFactory.create({
      _id: POST_ID_4,
      businessId: BUSINESS_ID,
      content:'fb pic',
      attachments: [
        { _id: 'attachments-id-1', contentType: 'png', url: 'url' },
      ],
      postState: [
        {
          integrationName: 'instagram-posts',
          status: 'succeeded'
        }
      ]
    }));
  }
}

export = PostFixture;
