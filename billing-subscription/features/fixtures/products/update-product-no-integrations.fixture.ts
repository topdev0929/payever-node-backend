import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ProductFactory } from '../factories';
import { ProductModel } from '../../../src/subscriptions/models';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class UpdateProductNoIntegrationsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));
  }
}

export = UpdateProductNoIntegrationsFixture;
