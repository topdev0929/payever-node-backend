import { pactConfiguration } from '../config';

export const amazonThirdPartyStub: any =  {
  id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  url: `http://localhost:${pactConfiguration.consumer.port}`,
  actions: [
    {
      name: 'sync-inventory',
      url: '/api/action/sync-inventory/:authorizationId',
      method: 'POST',
    },
    {
      name: 'subtract-inventory',
      url: '/api/action/subtract-inventory/:authorizationId',
      method: 'PATCH',
    },
    {
      name: 'add-inventory',
      url: '/api/action/add-inventory/:authorizationId',
      method: 'PATCH',
    },
    {
      name: 'set-inventory',
      url: '/api/action/set-inventory/:authorizationId',
      method: 'PATCH',
    },
    {
      name: 'sync-products',
      url: '/api/action/sync-products/:authorizationId',
      method: 'POST',
    },
    {
      name: 'update-product',
      url: '/api/action/update-product/:authorizationId',
      method: 'PATCH',
    },
    {
      name: 'create-product',
      url: '/api/action/create-product/:authorizationId',
      method: 'POST',
    },
  ],
};
