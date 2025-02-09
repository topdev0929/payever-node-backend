import { BaseFixture } from '@pe/cucumber-sdk';

class SubscriptionFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const businessId: string = 'b0df679c-15eb-5aff-8c98-7751ef9e448d';
    const integrationId: string = '452d4391-9be9-44c0-9ef0-3795df38a847';
    const subscriptionId: string = '95bebf40-0e03-4d06-9ad2-044121b8eb91';

    await this.connection.collection('businesses').insertOne({
      _id: businessId,
      subscriptions: [
        subscriptionId,
      ],
      legacyId: 28146,
      __v: 0,
      bankAccount: {},
      companyAddress: {
        country: '',
        city: '',
        street: '',
        zipCode: '',
      },
      contactDetails: {
        salutation: 'SALUTATION_MR',
        phone: '',
        fax: '',
        additionalPhone: '',
      },
      contactEmails: [],
      currency: 'EUR',
      name: 'autotest-rest-api-saint',
    });

    await this.connection.collection('integrations').insertOne({
      _id: integrationId,
      name: 'shopify',
      category: 'shopsystems',
      url: 'http://shopify-backend.micro/api',
      handshakeRequired: true,
      actions: [
        {
          description : '',
          name : 'connect',
          url : '/auth',
          method : 'POST',
          _id : '5087a497-3c62-4e81-938d-4972da0e8643',
        },
        {
          description : '',
          name : 'disconnect',
          url : '/auth/:authorizationId',
          method : 'DELETE',
          _id : 'd5056ea3-c566-49ae-855f-4f7f75047be8',
        },
        {
          description : '',
          name : 'custom_action',
          url : '/custom',
          method : 'POST',
          _id : 'd5056ea3-c566-49ae-855f-4f7f75047b18',
        },
      ],
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: subscriptionId,
      business: businessId,
      integration: integrationId,
      thirdparty: integrationId,

      connected: false,
      externalId: 'fd7f4999-07f8-4b6a-a3c3-20e95a63e59a',
    });
  }
}

export = SubscriptionFixture;
