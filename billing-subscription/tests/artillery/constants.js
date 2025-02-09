const DEFAULT = {
  businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
};

const USER = {
  email: 'artillery@payever.de',
  plainPassword: 'Payever123!',
}

const CONNECTION_API = {
  connectionId: 'a5d04638-4ef3-48b6-9da0-0bc6dede445c',
};

const PLAN = {
  productId: '5b7b0070-fab4-40fb-b7c6-f1a0114b485a',
};

const INTEGRATION = {
  integrationName: 'cash',
  category: 'payments'
};

const PRODUCT = {
  newProductId: '2fb0e559-be7a-4d96-b0fb-c36513482954'
}

const CONFIG = {
  target: 'https://billing-subscription-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    businessId: DEFAULT.businessId,
    email: USER.email,
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: USER.plainPassword,
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 200,
  }
};
module.exports = {
  DEFAULT,
  CONFIG,
  CONNECTION_API,
  PLAN,
  INTEGRATION,
  PRODUCT
};
