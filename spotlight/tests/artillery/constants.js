const SETTING = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  query: 'message'
};

const USER = {
  email: 'artillery@payever.de',
  plainPassword: 'Payever123!',
}

const CONFIG = {
  target: 'https://spotlight-shops.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: USER.email,
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: USER.plainPassword,
    businessId: SETTING.businessId,
    query: SETTING.query
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  }
};


module.exports = {
  SETTING,
  CONFIG
};
