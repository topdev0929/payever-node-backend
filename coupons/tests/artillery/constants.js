const businessId = '15278f88-9439-4ca5-a214-40b1cbc36ba7';

const COUPON = {
  channelsetId:'01684c6b-1691-48f5-89d7-6958d7a5bbd7',
  status: 'INACTIVE',
  type: 'PERCENTAGE',
  minimumRequirements: 'NONE',
  customerEligibility: 'EVERYONE',
  couponCode: 'TEST4',
  typeApplied: 'ALL_PRODUCTS',
  customerEmail: 'costumer@email.com'
}

const USER = {
  businessId,
  userId: 'c6e6b1a6-e7c7-48ee-979c-5886904e2f9a',
};

const CONFIG = {
  target: 'https://coupons-backend.test.devpayever.com',
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
  COUPON,
  USER,
};
