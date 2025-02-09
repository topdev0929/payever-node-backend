import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk/module';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory, productFactory, businessFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';
import { BusinessModel, BusinessSchemaName } from '../../.././../src/business';

const COLLECTION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID_1: string = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID_2: string = '22222222-2222-2222-2222-222222222222';
const PRODUCT_ID_3: string = '33333333-3333-3333-3333-333333333333';

class GetProductsByCollectionFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));
  private readonly productsModel: Model<ProductModel> = this.application.get('NewProductModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));
    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_ID,
      businessId: BUSINESS_ID,
    }));
    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID_1,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_ID],
      slug: 'some 1',
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID_2,
      businessId: BUSINESS_ID,
      collections: [COLLECTION_ID],
      slug: 'some 2',
    }));

    await this.productsModel.create(productFactory({
      _id: PRODUCT_ID_3,
      businessId: BUSINESS_ID,
      collections: [],
      slug: 'some 3',
    }));
  }
}

export = GetProductsByCollectionFixture;
