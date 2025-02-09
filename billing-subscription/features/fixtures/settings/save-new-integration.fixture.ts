import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory, ProductFactory, SubscriptionPlanFactory } from '../factories';
import {
  ProductModel,
  SubscriptionPlanModel,
  ConnectionModel,
} from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CONNECTION_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const SUBSCRIPTION_1_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';
const SUBSCRIPTION_2_PLAN_ID: string = 'dddddddd-2222-2222-2222-222222222222';

class SaveNewIntegrationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly businessIntegrationModel: Model<ConnectionModel> = this.application.get('ConnectionModel');

  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');

  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.businessIntegrationModel.create(ConnectionFactory.create({
      _id: CONNECTION_ID,
      businessId: BUSINESS_ID,
      integration: 'stripe',
      integrationName: 'stripe',
      isConnected: true,
    }));

    await this.productModel.create(ProductFactory.create({
      _id: 'aaaaaaaa-1111-1111-1111-111111111111',
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product 1',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: 'aaaaaaaa-2222-2222-2222-222222222222',
      businessId: BUSINESS_ID,
      price: 200,
      title: 'product 2',
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_1_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      products: ['aaaaaaaa-1111-1111-1111-111111111111'],
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_2_PLAN_ID,
      billingPeriod: 2,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      products: ['aaaaaaaa-2222-2222-2222-222222222222'],
    }));
  }
}

export = SaveNewIntegrationFixture;
