import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory, businessFactory } from './factories';

const businessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';
const channelSetId: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3';
const integrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const integrationIdTwo: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c9';
const integrationSubscriptionId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e600';
const integrationSubscriptionIdTwo: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e601';

class BusinessIntegrationSubscriptionsFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'test',
    }));

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationIdTwo,
      name: 'custom',
    }));

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: integrationSubscriptionId,
      enabled: true,
      installed: true,
      integration: integrationId,
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: integrationSubscriptionIdTwo,
      enabled: true,
      installed: true,
      integration: integrationIdTwo,
    });

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessId,
      companyAddress : {
        _id : '58a9ff1e-5789-4ca3-b3b1-58142225c7de',
        country : 'AM',
      },
      integrationSubscriptions: [integrationSubscriptionId],
    }));

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetId,
      businessId: businessId,
    });
  }
}

export = BusinessIntegrationSubscriptionsFixture;
