const COMMON = {
  countryCode: 'AT',
  disclaimer: 'disclaimer',
};

const businessId = '15278f88-9439-4ca5-a214-40b1cbc36ba7';


const CONFIG = {
  target: 'https://common-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
    businessId,
  },
  http: {
    timeout: 15,
  },
};


module.exports = {
  COMMON,
  CONFIG,
};

