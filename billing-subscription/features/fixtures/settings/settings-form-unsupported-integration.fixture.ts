import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ConnectionFactory } from '../factories';
import { ConnectionModel } from '../../../src/subscriptions/models';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class SettingFormUnsupportedIntegrationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly connectionModel: Model<ConnectionModel>
    = this.application.get('ConnectionModel');

  public async apply(): Promise<void> {

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.connectionModel.create(ConnectionFactory.create({
      businessId: BUSINESS_ID,
      integration: 'stripe',
      integrationName: 'stripe',
    }));

    await this.connectionModel.create(ConnectionFactory.create({
      businessId: BUSINESS_ID,
      integration: 'unsupported_integration',
      integrationName: 'unsupported_integration',
    }));
  }
}

export = SettingFormUnsupportedIntegrationFixture;
