import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory, PlanFactory, ProductFactory, SubscriptionPlanFactory } from '../factories';
import { ConnectionPlanModel, ProductModel, SubscriptionPlanModel } from '../../../src/subscriptions/models';
import { BillingIntervalsEnum, PaymentMethodsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';
import { ConnectionModel } from '../../../src/subscriptions/models/connection.model';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const PLAN_ID_1: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const PLAN_ID_2: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const SUBSCRIPTION_PLAN_ID: string = 'dddddddd-1111-1111-1111-111111111111';

const CONNECTION_STRIPE_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const CONNECTION_PAYPAL_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class DeleteProductFixture extends BaseFixture {
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
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));

    const connection1: ConnectionModel = await this.connectionModel.create({
      _id: CONNECTION_STRIPE_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
    });

    const connection2: ConnectionModel = await this.connectionModel.create({
      _id: CONNECTION_PAYPAL_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.paypal,
      integrationName: PaymentMethodsEnum.paypal,
    });

    await this.subscriptionPlanModel.create(SubscriptionPlanFactory.create({
      _id: SUBSCRIPTION_PLAN_ID,
      billingPeriod: 1,
      businessId: BUSINESS_ID,
      interval: BillingIntervalsEnum.MONTH,
      planType: PlanTypeEnum.fixed,
      product: PRODUCT_ID,
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID_1,
      businessId: BUSINESS_ID,
      connection: connection1.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID,
    }));

    await this.connectionPlanModel.create(PlanFactory.create({
      _id: PLAN_ID_2,
      businessId: BUSINESS_ID,
      connection: connection2.id,
      subscriptionPlan: SUBSCRIPTION_PLAN_ID,
    }));
  }
}

export = DeleteProductFixture;
