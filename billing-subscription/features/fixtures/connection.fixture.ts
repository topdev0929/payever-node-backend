import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory } from './factories';
import { ConnectionModel, IntegrationModel } from '../../src/subscriptions/models';
import { PaymentMethodsEnum } from '../../src/subscriptions/enums';
import { BusinessModel } from '../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CONNECTION_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const CONNECTION_IDTWO: string = 'dddddddd-dddd-dddd-dddd-dddddddddddc';

class ConnectionFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly connectionModel: Model<ConnectionModel> = this.application.get('ConnectionModel');
  private readonly integrationModel: Model<IntegrationModel> = this.application.get('IntegrationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.integrationModel.create({
      _id: PaymentMethodsEnum.stripe,
      category: 'payments',
      name: PaymentMethodsEnum.stripe,
    } as any);

    await this.integrationModel.create({
      _id: PaymentMethodsEnum.paypal,
      category: 'payments',
      name: PaymentMethodsEnum.paypal,
    } as any);

    await this.connectionModel.create({
      _id: CONNECTION_ID,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.stripe,
      integrationName: PaymentMethodsEnum.stripe,
    } as any);

    await this.connectionModel.create({
      _id: CONNECTION_IDTWO,
      businessId: BUSINESS_ID,
      integration: PaymentMethodsEnum.paypal,
      integrationName: PaymentMethodsEnum.paypal,
    } as any);

  }
}

export = ConnectionFixture;
