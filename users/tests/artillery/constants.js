const USER = {
  businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
  userId: 'c6e6b1a6-e7c7-48ee-979c-5886904e2f9a',
};

const EMPLOYEE = {
  position: 'Cashier',
  status: 0,
  limit: 10,
  page: 1,
};

const TRUSTED_DOMAIN = {
  domain: 'payever@domain.com',
}

const SLUG = {
  businessSlug: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
};

const LEGAL_DOCUMENTS = {
  businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
  type: 'disclaimer',
};

const CONFIG = {
  target: 'https://users.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  }

};


module.exports = {
  CONFIG,
  EMPLOYEE,
  LEGAL_DOCUMENTS,
  SLUG,
  TRUSTED_DOMAIN,
  USER,
};
