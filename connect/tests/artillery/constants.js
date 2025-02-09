const CURRENCY = {
  currencyCode: 'EUR',
};

const INTEGRATIONS_MANAGEMENT = {
  id: '492ed18b-c441-4501-9c37-dc3b0321d6f4',
};

const PAYMENTS = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  integrationName: 'stripe',
};

const INTEGRATION = {
  category: 'payments',
};

const INTEGRATION_SUBSCRIPTIONS = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  category: 'payments',
  integrationName: 'stripe',
};

const FOLDERS_BUSINESS = {
  documentId: '157e2b4b-b280-4b49-a7b9-6bb37786001d',
  folderId: 'cabf6916-594b-4b49-bff3-02253d4fdfab',
  locationId: 'cabf6916-594b-4b49-bff3-02253d4fdfab',
}

const FOLDERS_ADMIN = {
  folderId: 'c09bbd46-9a12-4848-b54a-345516a08a3f'
}

const ADMIN_CATEGORIES = {
  categoryId: 'd67adee3-5eef-4a83-abab-4c2047c62f7f'
}

const ADMIN_INTEGRATIONS = {
  integrationId: '6fc2e9be-bc7e-4c14-9f88-d4f9ffce9ba4'
}

const ADMIN_INTEGRATION_SUBSCRIPTIONS = {
  integrationSubscriptionId: '00393040-93be-4171-bb98-c2bd080c9d7e'
}

const INTEGRATION_WRAPPER = {
  wrapperType: 'openbank'
}

const CONFIG = {
  http: {
    timeout: 15,
  },
  target: 'https://connect-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
  },
};



module.exports = {
  ADMIN_CATEGORIES,
  ADMIN_INTEGRATIONS,
  ADMIN_INTEGRATION_SUBSCRIPTIONS,
  CONFIG,
  CURRENCY,
  FOLDERS_ADMIN,
  FOLDERS_BUSINESS,
  INTEGRATION,
  INTEGRATIONS_MANAGEMENT,
  INTEGRATION_SUBSCRIPTIONS,
  INTEGRATION_WRAPPER,
  PAYMENTS
};
