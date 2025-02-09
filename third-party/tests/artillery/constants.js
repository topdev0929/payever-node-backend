const INVOICE = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'shopify',
};

const COMMUNICATIONS = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'shopify',
};

const BUSINESS_SUBSCRIPTIONS = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'shopify',
  category: 'payments',
  action: 'connect',
};

const PAYMENTS = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'shopify',
  paymentOptionId: 4,
};

const DEFAULT = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  authorizationId: '3c6aac55-7f19-4db4-a9f8-052d39facd03',
  transactionId: '610a51c0-4daa-43e8-92fd-b7911b79c995',
  originalId: 'b0482f0c61607a5ff2a94f04c0316933',
  action: 'connect',
  reference: 'test for cheduled',
};

const PLUGINS_SUBSCRIPTIONS = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'shopify',
};

const SHIPPING = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  integrationName: 'dhl',
  subscriptionId: '0009b026-5af9-4b06-98aa-090c086c748a',
};

const AUTO_DISCOVERY = {
  integrationName: 'sofort',
};

const BUSINESS_CONNECTIONS = {
  category: 'payments',
  integrationName: 'dhl',
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
};

const CONNECTION_RELATED_ACTIONS = {
  action: 'connect',
  connectionId: '44a1bc61-8fcf-4323-a544-958dc84a64c7',
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
};

const OUTER_INTEGRATION_CONNECTION_ACTIONS = {
  action: 'connect',
  integrationName: 'dhl',
  authorizationId: '3c6aac55-7f19-4db4-a9f8-052d39facd03',
};

const INTEGRATION_RELATED_ACTIONS = {
  action: 'connect',
  integrationName: 'dhl',
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
};

const INTEGRATION = {
  category: 'payments',
};

const OUTER_INTEGRATION_CONNECTIONS = {
  action: 'connect',
  integrationName: 'dhl',
  authorizationId: '3c6aac55-7f19-4db4-a9f8-052d39facd03',
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
};

module.exports = {
  INVOICE,
  COMMUNICATIONS,
  BUSINESS_SUBSCRIPTIONS,
  PAYMENTS,
  DEFAULT,
  PLUGINS_SUBSCRIPTIONS,
  SHIPPING,
  AUTO_DISCOVERY,
  BUSINESS_CONNECTIONS,
  CONNECTION_RELATED_ACTIONS,
  OUTER_INTEGRATION_CONNECTION_ACTIONS,
  INTEGRATION_RELATED_ACTIONS,
  INTEGRATION,
  OUTER_INTEGRATION_CONNECTIONS,
};
