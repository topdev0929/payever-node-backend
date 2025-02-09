import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const connectionId: string = 'sssssss-ssss-sss-sssss-sssssss';
    const integrationId: string = '452d4391-9be9-44c0-9ef0-3795df38a847';
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
    });

    await this.connection.collection('connections').insertOne({
      _id: connectionId,
      business: businessId,
      integration: integrationId,

      authorizationId: 'fd7f4999-07f8-4b6a-a3c3-20e95a63e59a',
      connected: false,
    });
  }
}

export = BusinessesFixture;
