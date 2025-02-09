import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, PlanFactory, ProductFactory, SubscriptionPlanFactory } from '../factories';
import {
  ConnectionPlanModel,
  ProductModel,
  SubscriptionPlanModel,
  ConnectionModel,
} from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID_1: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const PRODUCT_ID_2: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const PLAN_ID_1: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const PLAN_ID_2: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const CONNECTION_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const SUBSCRIPTION_PLAN_ID_1: string = 'dddddddd-1111-1111-1111-111111111111';
const SUBSCRIPTION_PLAN_ID_2: string = 'dddddddd-2222-2222-2222-222222222222';

class RetrievePlansForProductsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly connectionPlanModel: Model<ConnectionPlanModel> = this.application.get('ConnectionPlanModel');
  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');
  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID_1,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID_2,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));

    const connection: ConnectionModel = await this.connectionModel.create({
      _id: CONNECTION_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
    });

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_PLAN_ID_1,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      name: 'Some Subscription Plan Name',
      planType: PlanTypeEnum.fixed,
      products: [PRODUCT_ID_1],
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_PLAN_ID_2,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      name: 'Some Subscription Plan Name',
      planType: PlanTypeEnum.fixed,
      products: [PRODUCT_ID_2],
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID_1,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID_1,
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID_2,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID_2,
    }));
  }
}

export = RetrievePlansForProductsFixture;
