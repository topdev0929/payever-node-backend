export const ProductsIntegrationActionsFixture: any = [
  {
    description: '',
    method: 'POST',
    name: 'connect',
    url: '/auth',
  },
  {
    description: '',
    method: 'DELETE',
    name: 'disconnect',
    url: '/auth/:authorizationId',
  },
  {
    description: '',
    method: 'POST',
    name: 'form',
    url: '/form',
  },
  {
    description: '',
    method: 'POST',
    name: 'form-connect',
    url: '/form/form-connect',
  },
  {
    description: '',
    method: 'POST',
    name: 'form-disconnect',
    url: '/form/form-disconnect',
  },
  {
    description: '',
    method: 'POST',
    name: 'create-product',
    url: '/action/create-product/:authorizationId',
  },
  {
    description: '',
    method: 'PATCH',
    name: 'update-product',
    url: '/action/update-product/:authorizationId',
  },

  {
    description: '',
    method: 'DELETE',
    name: 'remove-product',
    url: '/action/remove-product/:authorizationId',
  },

  {
    description: '',
    method: 'PATCH',
    name: 'add-inventory',
    url: '/action/add-inventory/:authorizationId',
  },
  {
    description: '',
    method: 'PATCH',
    name: 'subtract-inventory',
    url: '/action/subtract-inventory/:authorizationId',
  },

  {
    description: '',
    method: 'PATCH',
    name: 'set-inventory',
    url: '/action/set-inventory/:authorizationId',
  },
  {
    description: '',
    method: 'POST',
    name: 'sync-inventory',
    url: '/action/sync-inventory/:authorizationId',
  },
  {
    description: '',
    method: 'POST',
    name: 'sync-products',
    url: '/action/sync-products/:authorizationId',
  },
];
