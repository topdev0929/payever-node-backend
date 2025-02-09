import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import {
  BusinessFactory,
  ConnectionFactory,
  PlanFactory,
  ProductFactory,
  SubscriptionFactory,
  SubscriptionPlanFactory,
} from './factories';
import {
  ConnectionPlanModel,
  ProductModel,
  SubscriptionModel,
  SubscriptionPlanModel,
  ConnectionModel,
  CustomerSubscriptionPlanModel,
  SubscribersGroupModel,
  SubscriptionPlansGroupModel,
} from '../../src/subscriptions/models';
import { BusinessModel } from '../../src/business';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../src/subscriptions/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SUBSCRIPTION_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';
const SUBSCRIPTION_PLAN_GROUP_ID: string = 'pppppppp-1111-1111-1111-111111111111';
const SUBSCRIBERS_GROUP_ID: string = 'gggggggg-1111-1111-1111-111111111111';
const CUSTOMER_SUBSCRIPTION_PLAN_ID: string = 'eeeeeeee-1111-1111-1111-111111111111';
const CONNECTION_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const PLAN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const SUBSCRIPTION_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const USER_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class CreateSubscriptionPlanFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');
  private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> = this.application.get('SubscriptionPlanModel');
  private readonly subscribersGroupModel: Model<SubscribersGroupModel> = this.application.get('SubscribersGroupModel');
  private readonly subscriptionPlansGroupModel: Model<SubscriptionPlansGroupModel> = this.application.get('PlansGroupModel');
  private readonly customersubscriptionPlanModel: Model<CustomerSubscriptionPlanModel>
    = this.application.get('CustomerPlanSubscriptionModel');
  private readonly connectionPlanModel: Model<ConnectionPlanModel> = this.application.get('ConnectionPlanModel');
  private readonly subscriptionModel: Model<SubscriptionModel> = this.application.get('SubscriptionModel');

  public async apply(): Promise<void> {
    await this.customersubscriptionPlanModel.create({
      _id: CUSTOMER_SUBSCRIPTION_PLAN_ID,
      plan: PLAN_ID,
      quantity: 2,
      reference: 'ref',
      subscribersGroups: [SUBSCRIPTION_PLAN_ID],
      transactionId: 'tId',
    });

    await this.subscriptionPlansGroupModel.create({
      _id: SUBSCRIPTION_PLAN_GROUP_ID,
      name: 'name',
      plans: SUBSCRIPTION_PLAN_ID,
    } as any);

    await this.subscribersGroupModel.create({
      _id: SUBSCRIBERS_GROUP_ID,
      name: 'name',
      subscribers: [PLAN_ID],
    } as any);

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
