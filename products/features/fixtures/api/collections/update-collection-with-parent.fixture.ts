import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const COLLECTION_CHILD: string = '0a5af4b4-357f-47aa-96d5-6960f51b5084';
const COLLECTION_BASE: string = '7ff8b1b1-d6fb-4945-ae92-9e600a51d18c';
const COLLECTION_CHILD2: string = '7b224952-d673-491d-88e4-8ae13acdaf6e';
const COLLECTION_BASE2: string = '416e3c22-5959-4cdb-9b1b-db5b942800c0';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const OTHER_COLLECTION: string = '367d1a3a-7010-44d1-b3ac-28a12cc8cb86';
const BUSINESS_ID2: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateCollectionWithParentFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {

    await this.collectionModel.create(CollectionFactory.create({
      _id: OTHER_COLLECTION,
      businessId: BUSINESS_ID2,
      name: 'other collection base',
      slug: 'other_collection_base',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_BASE,
      businessId: BUSINESS_ID,
      name: 'collection base',
      slug: 'collection_base',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_CHILD,
      ancestors: [COLLECTION_BASE],
      businessId: BUSINESS_ID,
      name: 'collection child',
      parent: COLLECTION_BASE,
      slug: 'collection_child',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_BASE2,
      businessId: BUSINESS_ID,
      name: 'collection base2',
      slug: 'collection_base2',
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_CHILD2,
      ancestors: [COLLECTION_BASE2],
      businessId: BUSINESS_ID,
      name: 'collection child2',
      parent: COLLECTION_BASE2,
      slug: 'collection_child2',
    }));

  }
}

export = CreateCollectionWithParentFixture;
