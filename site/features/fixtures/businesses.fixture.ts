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

    await this.connection.collection('integrations').insertOne({
      _id: integrationId,
      name: 'dhl',
      category: 'shipping',
      url: "https://dhl-backend.test.davpayever.com/api",
      createdAt: new Date(),
      updatedAt: new Date(),
      autoConnect: false,    
      actions: [ 
        {
          _id: '93a86176-f3e4-11e9-91cb-fbdf5b1307ac',
          description: '',
          method: 'POST',
          name: 'form',
          url: '/form',
        },
        {
          _id: '93a86176-f3e4-11e9-91cb-fbdf5b1307ac',
          description: '',
          method: 'POST',
          name: 'disconnect-app',
          url: '/form/disconnect-app',
        },
        {
          _id: '94a87176-f3e4-11e9-92cb-fcdf5b1307ac',
          description: '',
          method: 'POST',
          name: 'save-options',
          url: '/form/save-options',
        },
        {
          _id: '93a86176-f3e4-11e9-91cb-fbdf5b1307ad',
          description: '',
          method: 'POST',
          name: 'create-product',
          url: '/products/create-product/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '0a258012-7c28-4235-8f2d-5b4a64d4455e',
          description: '',
          method: 'PATCH',
          name: 'update-product',
          url: '/products/update-product/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: 'f6a45d02-4e66-468b-92f0-89b7e72330b4',
          description: '',
          method: 'DELETE',
          name: 'delete-product',
          url: '/products/delete-product/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: 'acd64173-21a5-4176-82c0-e5b1c4a7ee02',
          description: '',
          method: 'POST',
          name: 'create-collection',
          url: '/products/create-collection/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '66c9d0e6-ad9a-413b-b88a-6b03542ff14d',
          description: '',
          method: 'PATCH',
          name: 'update-collection',
          url: '/products/update-collection/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '33038d2c-cd72-4682-93c9-35452f7a0bd9',
          description: '',
          method: 'DELETE',
          name: 'delete-collection',
          url: '/products/delete-collection/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '33038d2c-cd72-4682-93c9-35452f7a0bd9',
          description: '',
          method: 'POST',
          name: 'sync-products',
          url: '/products/sync-products/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '34039d2d-cd73-4683-93c9-35452f7a0bd9',
          description: '',
          method: 'POST',
          name: 'add-inventory',
          url: '/products/add-inventory/businessId/:businessUuid/authId/:authorizationId',
        },
        {
          _id: '44039d2d-cd83-4683-94c9-37452f8a0bd9',
          description: '',
          method: 'POST',
          name: 'subtract-inventory',
          url: '/products/subtract-inventory/businessId/:businessUuid/authId/:authorizationId',
        },
      ],
    });
  }
}

export = BusinessesFixture;
