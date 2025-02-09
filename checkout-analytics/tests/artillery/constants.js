const CHECKOUT_METRICS = {
  flowId: '1110c1ee787e80d98e0994cf981698c5',
  paymentMethod: 'sofort',
  type: 'RATE_STEP_PASSED',
};

const CONFIG = {
  target: 'https://checkout-analytics-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  }
};

module.exports = {
  CONFIG,
  CHECKOUT_METRICS,
};
