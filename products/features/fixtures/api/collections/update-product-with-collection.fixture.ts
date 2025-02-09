import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory, productFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';

const COLLECTION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class UpdateProductWithCollectionFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));
  private readonly productsModel: Model<ProductModel> = this.application.get(getModelToken('Product'));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_ID,
      businessId: BUSINESS_ID,
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
    }));
  }
}

export = UpdateProductWithCollectionFixture;
