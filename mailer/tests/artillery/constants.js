const businessId = '205954e0-4641-41fa-b6ca-6d0d83b37fad';

const DEFAULT = {
  businessId,
  paymentMailId: '00023a28-a1fe-4e38-a415-b9a603111941',
  transactionId: '3ff32ca4-1963-4fd3-bcb6-1f91d90fedd8',
};

const CONFIG = {
  target: 'https://mailer.test.devpayever.com',
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
  CONFIG,
  DEFAULT,
};
