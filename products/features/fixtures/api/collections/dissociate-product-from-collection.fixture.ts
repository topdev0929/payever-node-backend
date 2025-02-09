import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory, productFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const COLLECTION_BY_TITLE_ID: string = '11111111-1111-1111-1111-111111111111';
const MANUAL_COLLECTION_ID: string = '44444444-4444-4444-4444-444444444444';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class AutoFillProductOnProductUpdateFixture extends BaseFixture {
  private readonly productsModel: Model<ProductModel> = this.application.get(getModelToken('Product'));
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_BY_TITLE_ID,
      automaticFillConditions: {
        filters: [{
          field: 'title',
          fieldCondition: 'contains',
          fieldType: 'string',
          value: 'Test title',
        }],
        strict: true,
      },
      businessId: BUSINESS_ID,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: MANUAL_COLLECTION_ID,
      automaticFillConditions: {
        filters: [],
        strict: true,
      },
      businessId: BUSINESS_ID,
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_BY_TITLE_ID, MANUAL_COLLECTION_ID],
      price: 1000,
    }));
  }
}

export = AutoFillProductOnProductUpdateFixture;
