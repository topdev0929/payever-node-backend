import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory, productFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';

const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const COLLECTION_ID: string = '11111111-1111-1111-1111-111111111111';

class AutoCollectionWithManualProductFixture extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get(getModelToken('Product'));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_ID,
      automaticFillConditions: {
        filters: {
          field: 'variant_name',
          fieldCondition: 'isNot',
          fieldType: 'string',
          value: 'Test title',
        },
        manualProductsList: [PRODUCT_ID],
        strict: false,
      },
      businessId: BUSINESS_ID,
    }));

    await this.productModel.create(productFactory({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_ID],
    }));
  }
}

export = AutoCollectionWithManualProductFixture;
