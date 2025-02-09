import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory, PlanFactory, ProductFactory, SubscriptionPlanFactory } from '../factories';
import {
  ConnectionPlanModel,
  ProductModel,
  SubscriptionPlanModel,
  ConnectionModel,
} from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID_1: string = 'aaaaaaaa-1111-1111-1111-111111111111';
const PRODUCT_ID_2: string = 'aaaaaaaa-2222-2222-2222-222222222222';
const SUBSCRIPTION_1_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';
const SUBSCRIPTION_2_PLAN_ID: string = 'dddddddd-2222-2222-2222-222222222222';
const PRODUCT_1_PLAN_ID: string = 'cccccccc-1111-1111-1111-111111111111';
const PRODUCT_2_PLAN_ID: string = 'cccccccc-2222-2222-2222-222222222222';
const CONNECTION_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

class DisableIntegrationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');

  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly connectionPlanModel: Model<ConnectionPlanModel> = this.application.get('ConnectionPlanModel');
  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    const connection: ConnectionModel = await this.connectionModel.create(ConnectionFactory.create({
      _id: CONNECTION_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
      isEnabled: true,
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID_1,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product 1',
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_1_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      products: [PRODUCT_ID_1],
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PRODUCT_1_PLAN_ID,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_1_PLAN_ID,
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID_2,
      businessId: BUSINESS_ID,
      price: 200,
      title: 'product 2',
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_2_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      products: [PRODUCT_ID_2],
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PRODUCT_2_PLAN_ID,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_2_PLAN_ID,
    }));
  }
}

export = DisableIntegrationFixture;
