import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory } from '../factories';
import { ProductModel } from '../../../src/subscriptions/models';
import { PaymentMethodsEnum } from '../../../src/subscriptions/enums';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CONNECTION_STRIPE_ID: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const CONNECTION_PAYPAL_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class CreateProductIntegrationsEnabledFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly productModel: Model<ProductModel> = this.application.get('ConnectionModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.productModel.create(ConnectionFactory.create({
      _id: CONNECTION_STRIPE_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
      isEnabled: true,
    }));

    await this.productModel.create(ConnectionFactory.create({
      _id: CONNECTION_PAYPAL_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.paypal,
      integrationName: PaymentMethodsEnum.paypal,
      isEnabled: true,
    }));
  }
}

export = CreateProductIntegrationsEnabledFixture;
