import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import {
  BusinessFactory,
  ConnectionFactory,
  PlanFactory,
  ProductFactory,
  SubscriptionFactory,
  SubscriptionPlanFactory,
} from '../factories';
import {
  ConnectionPlanModel,
  ProductModel,
  SubscriptionModel,
  SubscriptionPlanModel,
  ConnectionModel,
} from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SUBSCRIPTION_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';
const CONNECTION_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const PLAN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const SUBSCRIPTION_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const USER_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class CreateSubscriptionPlanFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');
  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');
  private readonly connectionPlanModel: Model<ConnectionPlanModel> = this.application.get('ConnectionPlanModel');
  private readonly subscriptionModel: Model<SubscriptionModel> = this.application.get('SubscriptionModel');

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

    const connection: ConnectionModel = await this.connectionModel.create(ConnectionFactory.create({
      _id: CONNECTION_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.paypal,
      integrationName: PaymentMethodsEnum.stripe,
      isEnabled: true,
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      name: 'Some subscription plan',
      planType: PlanTypeEnum.fixed,
      products: [PRODUCT_ID],
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID,
    }));

    await this.subscriptionModel.create(SubscriptionFactory.create({
      _id: SUBSCRIPTION_ID,
      plan: PLAN_ID,
      reference: 'a260a916-137b-4eb7-a54f-a135ea36577b',
      remoteSubscriptionId: 'some_identifier',
      userId: USER_ID,
    }));
  }
}

export = CreateSubscriptionPlanFixture;
