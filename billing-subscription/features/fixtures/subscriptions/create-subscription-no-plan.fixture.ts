import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory, PlanFactory, ProductFactory } from '../factories';
import {
  ProductModel,
  ConnectionModel,
} from '../../../src/subscriptions/models';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateSubscriptionNoPlanFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly businessIntegrationModel: Model<ConnectionModel>
    = this.application.get('ConnectionModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));

    await this.businessIntegrationModel.create(ConnectionFactory.create({
      businessId: BUSINESS_ID,
      integrationName: 'stripe',
      isEnabled: true,
    }));
  }
}

export = CreateSubscriptionNoPlanFixture;
