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
  ConnectionModel,
  ConnectionPlanModel,
  ProductModel,
  SubscriptionModel,
  SubscriptionPlanModel,
} from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const PLAN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const SUBSCRIPTION_ID_1: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const SUBSCRIPTION_ID_2: string = 'ffffffff-1111-1111-1111-111111111111';
const SUBSCRIPTION_ID_3: string = 'ffffffff-2222-2222-2222-222222222222';
const TRANSACTION_ID_1: string = '11111111-1111-1111-1111-111111111111';
const TRANSACTION_ID_2: string = '22222222-2222-2222-2222-222222222222';
const TRANSACTION_ID_3: string = '33333333-3333-3333-3333-333333333333';
const CONNECTION_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const SUBSCRIPTION_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';
const USER_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class DeleteSubscriptionFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');
  private readonly connectionPlanModel: Model<ConnectionPlanModel> = this.application.get('ConnectionPlanModel');
  private readonly subscriptionModel: Model<SubscriptionModel> = this.application.get('SubscriptionModel');
  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');

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
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
      isEnabled: true,
    }));

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      product: PRODUCT_ID,
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID,
      businessId: BUSINESS_ID,
      connection: connection.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID,
    }));

    await this.subscriptionModel.create(SubscriptionFactory.create({
      _id: SUBSCRIPTION_ID_1,
      customerEmail: 'customer@email',
      customerName: 'Customer name 1',
      plan: PLAN_ID,
      reference: 'a71746b8-1456-44d0-8715-ade591a434b6',
      remoteSubscriptionId: 'some_identifier',
      transactionUuid: TRANSACTION_ID_1,
      userId: USER_ID,
    }));

    await this.subscriptionModel.create(SubscriptionFactory.create({
      _id: SUBSCRIPTION_ID_2,
      customerEmail: 'customer@email',
      customerName: 'Customer name 2',
      plan: PLAN_ID,
      reference: 'b2ef01c4-76a0-4b09-bb87-bdaf68af243d',
      remoteSubscriptionId: 'some_identifier',
      transactionUuid: TRANSACTION_ID_2,
      userId: USER_ID,
    }));

    await this.subscriptionModel.create(SubscriptionFactory.create({
      _id: SUBSCRIPTION_ID_3,
      customerEmail: 'customer@email',
      customerName: 'Customer name 3',
      plan: PLAN_ID,
      reference: '506b8e65-57c4-4156-9eec-649d88d05f4c',
      remoteSubscriptionId: 'some_identifier',
      transactionUuid: TRANSACTION_ID_3,
      userId: USER_ID,
    }));
  }
}

export = DeleteSubscriptionFixture;
