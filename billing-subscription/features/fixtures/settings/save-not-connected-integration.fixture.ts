import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ConnectionModel } from '../../../src/subscriptions/models';
import { BusinessFactory, ConnectionFactory } from '../factories';
import { BusinessModel } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class SaveNotConnectedIntegrationFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  private readonly businessIntegrationModel: Model<ConnectionModel>
    = this.application.get('ConnectionModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.businessIntegrationModel.create(ConnectionFactory.create({
      businessId: BUSINESS_ID,
      integration: 'stripe',
      integrationName: 'stripe',
    }));
  }
}

export = SaveNotConnectedIntegrationFixture;
