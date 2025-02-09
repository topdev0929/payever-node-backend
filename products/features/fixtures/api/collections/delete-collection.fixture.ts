import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory, productFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';

const COLLECTION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const ANOTHER_COLLECTION_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID_1: string = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID_2: string = '22222222-2222-2222-2222-222222222222';

class DeleteCollectionFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));
  private readonly productsModel: Model<ProductModel> = this.application.get('NewProductModel');

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_ID,
      businessId: BUSINESS_ID,
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID_1,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_ID, ANOTHER_COLLECTION_ID],
      slug: 'some 1',
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID_2,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_ID],
      slug: 'some 2',
    }));
  }
}

export = DeleteCollectionFixture;
