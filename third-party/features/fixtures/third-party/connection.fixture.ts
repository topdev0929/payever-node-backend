import { BaseFixture } from '@pe/cucumber-sdk';

class SubscriptionFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const businessId: string = 'b0df679c-15eb-5aff-8c98-7751ef9e448d';
    const integrationId: string = '452d4391-9be9-44c0-9ef0-3795df38a847';
    const subscriptionId: string = '95bebf40-0e03-4d06-9ad2-044121b8eb91';

    await this.connection.collection('connections').insertOne({
      _id: subscriptionId,
      business: businessId,
      integration: integrationId,

      authorizationId: 'fd7f4999-07f8-4b6a-a3c3-20e95a63e59a',
      connected: false,
    });
  }
}

export = SubscriptionFixture;
