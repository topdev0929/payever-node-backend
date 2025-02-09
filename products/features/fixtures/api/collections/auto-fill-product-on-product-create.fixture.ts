import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { CollectionModel } from '../../../../src/categories/models';
import { CollectionSchemaName } from '../../../../src/categories/schemas';
import { CollectionFactory } from '../../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const COLLECTION_BY_TITLE_ID: string = '11111111-1111-1111-1111-111111111111';
const COLLECTION_BY_VARIANT_PRICE_ID: string = '22222222-2222-2222-2222-222222222222';
const COLLECTION_BY_PRICE_TITLE_ID: string = '33333333-3333-3333-3333-333333333333';

class AutoFillProductOnProductCreateFixture extends BaseFixture {
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
      slug: '1',
      businessId: BUSINESS_ID,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_BY_VARIANT_PRICE_ID,
      automaticFillConditions: {
        filters: [{
          field: 'variant_price',
          fieldCondition: 'lessThan',
          fieldType: 'number',
          value: 50,
        }],
        strict: false,
      },
      slug: '2',
      businessId: BUSINESS_ID,
    }));

    await this.collectionModel.create(CollectionFactory.create({
      _id: COLLECTION_BY_PRICE_TITLE_ID,
      automaticFillConditions: {
        filters: [{
          field: 'price',
          fieldCondition: 'lessThan',
          fieldType: 'number',
          value: 100,
        }],
        strict: true,
      },
      slug: '3',
      businessId: BUSINESS_ID,
    }));
  }
}

export = AutoFillProductOnProductCreateFixture;
