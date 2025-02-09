import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const PARENT_ID: string = '7ff8b1b1-d6fb-4945-ae92-9e600a51d18c';
const PARENT_ID2: string = 'ad76efe5-68bd-4834-8079-0a138685fbd9';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_PARENT_ID: string = '323748c8-7fc9-4389-ba9a-79fe99c2af8e';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateCollectionWithParentFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {

    await this.collectionModel.create(CollectionFactory.create({
      _id: PARENT_ID,
      ancestors: [PARENT_ID2],
      businessId: BUSINESS_ID,
      parent: PARENT_ID2,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: PARENT_ID2,
      businessId: BUSINESS_ID,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: ANOTHER_PARENT_ID,
      businessId: ANOTHER_BUSINESS_ID,
    }));
  }
}

export = CreateCollectionWithParentFixture;
