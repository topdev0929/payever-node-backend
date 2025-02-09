import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { BusinessFactory, ProductFactory } from '../factories';
import { BusinessModel, ProductModel } from '../../../src/marketplace/interfaces';
import { BusinessSchemaName, ProductSchemaName, ProductSubscriptionSchemaName } from '../../../src/marketplace/schemas';
import { ProductSubscriptionModel } from '../../../src/marketplace/interfaces/entities';

const OWNER_BUSINESS_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateProductSubscriptionFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get(getModelToken(ProductSchemaName));
  private readonly productSubscriptionModel: Model<ProductSubscriptionModel> =
    this.application.get(getModelToken(ProductSubscriptionSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'test',
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: OWNER_BUSINESS_ID,
      name: 'owner',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));

    await this.productSubscriptionModel.create(ProductFactory.create({
      businessId: BUSINESS_ID,
      marketplaceProduct: PRODUCT_ID,
    }));
  }
}

export = CreateProductSubscriptionFixture;
