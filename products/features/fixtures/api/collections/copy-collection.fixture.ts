import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const collectionID: string = '74db030f-3a79-4b6d-9a2e-10f7588b93f1';
const collectionID2: string = 'ba087e70-c5b2-45bc-b79c-8f1d456c8157';
const collectionID3: string = 'db785216-fc2e-4fc6-8aa6-77bd1feead62';
const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';


class CollectionFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: collectionID,
      businessId: someBusinessId,
    }));
    await this.collectionModel.create(CollectionFactory.create({
      _id: collectionID2,
      businessId: someBusinessId,
    }));
    await this.collectionModel.create(CollectionFactory.create({
      _id: collectionID3,
      businessId: someOtherBusinessId,
    }));
  }
}

export = CollectionFixture;
