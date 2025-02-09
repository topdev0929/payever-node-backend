import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const PARENT_ID: string = '7ff8b1b1-d6fb-4945-ae92-9e600a51d18c';
const PARENT_ID2: string = 'ad76efe5-68bd-4834-8079-0a138685fbd9';
const PARENT_ID3: string = '416e3c22-5959-4cdb-9b1b-db5b942800c0';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class CreateCollectionWithParentFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {

    await this.collectionModel.create(CollectionFactory.create({
      _id: PARENT_ID3,
      businessId: BUSINESS_ID,
      name: 'collection base',
      slug: 'collection_base',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: PARENT_ID2,
      ancestors: [PARENT_ID3],
      businessId: BUSINESS_ID,
      name: 'collection parent',
      parent: PARENT_ID3,
      slug: 'collection_parent',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: PARENT_ID,
      ancestors: [PARENT_ID3, PARENT_ID2],
      businessId: BUSINESS_ID,
      name: 'collection child',
      parent: PARENT_ID2,
      slug: 'collection_child',
    }));
  }
}

export = CreateCollectionWithParentFixture;
