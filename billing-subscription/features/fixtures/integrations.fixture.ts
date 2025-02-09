import { BaseFixture } from '@pe/cucumber-sdk/module';

class IntegrationsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('integrations').insertMany([
      {
        category: 'payments',
        name: 'stripe',
      },
      {
        category: 'payments',
        name: 'paypal',
      },
    ]);
  }
}

export = IntegrationsFixture;
