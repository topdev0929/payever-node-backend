import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory } from './factories';
const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const integrationId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';
const integrationSubscriptionId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e600';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      companyAddress : {
        _id : '58a9ff1e-5789-4ca3-b3b1-58142225c7de',
        country : 'AM',
      },
      integrationSubscriptions: [integrationSubscriptionId],
    });

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'test',
    }));

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: integrationSubscriptionId,
      enabled: true,
      installed: true,
      integration: integrationId,
    });
  }
}

export = BusinessesFixture;
