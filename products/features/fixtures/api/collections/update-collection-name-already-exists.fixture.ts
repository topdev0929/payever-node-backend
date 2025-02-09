import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const COLLECTION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const OCCUPIED_NAME: string = 'Occupied name';

class UpdateCollectionNameAlreadyExistsFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_ID,
      businessId: BUSINESS_ID,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      businessId: BUSINESS_ID,
      name: OCCUPIED_NAME,
    }));
  }
}

export = UpdateCollectionNameAlreadyExistsFixture;
