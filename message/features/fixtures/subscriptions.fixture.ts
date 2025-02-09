import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { SubscriptionDocument } from '../../src/projections/models';
import { ID_OF_SUBSCRIPTION, ID_OF_EXISTING_BUSINESS } from './const';
import { integrationsFixture } from '../../fixtures/integrations.fixture';

class SubscriptionFixture extends BaseFixture {
  protected readonly subscriptionModel: Model<SubscriptionDocument> = this.application.get(`SubscriptionModel`);
  public async apply(): Promise<void> {
    await this.subscriptionModel.create({
      _id: ID_OF_SUBSCRIPTION,
      business: ID_OF_EXISTING_BUSINESS,
      enabled: true,
      installed: true,
      integration: integrationsFixture[0]._id,
    });
  }
}

export = SubscriptionFixture;
