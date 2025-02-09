const BUSINESS_INTEGRATION = {
  category: 'payments',
};

const CHANNEL_SET = {
  type: 'checkout',
};

const FLOW = {
  flowId: '35795d4ecd0240ce4cbc201edb724bc7',
};

const INTEGRATION = {
  category: 'payments',
};

const LEGACY_API = {
  clientId: '00b6d075-1b87-4077-bc57-11536fac35a4',
  clientSecret: 'd5653b0b4e3ade27641304b5d1e968e05ac7a627aa0123d5',
  paymentId: '0003e7ee3aa75a0a1d9fcd37ed261a2f',
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  channelSetId: 'dcb0f287-08a2-4a60-b0f8-7e8476acfda4',
};

const CHECKOUT_INTEGRATION = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
};

const PAY_INIT = {
  channelSetId: 'dcb0f287-08a2-4a60-b0f8-7e8476acfda4',
};

const ADMIN = {
  channelSetId: 'dcb0f287-08a2-4a60-b0f8-7e8476acfda4',
};

const SCHEDULE = {
  scheduleId: '9bb1e4e4-972b-4b0d-af55-802af94da9a3'
}

const CONFIG = {
  http: {
    timeout: 15,
  },
  target: 'https://checkout-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    businessId: 'bd6d07d3-dce0-4287-9e2d-c37797006bce',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    userAgent: 'Artillery (https://artillery.io)'
  },
};

module.exports = {
  BUSINESS_INTEGRATION,
  CHANNEL_SET,
  CHECKOUT_INTEGRATION,
  FLOW,
  INTEGRATION,
  LEGACY_API,
  CONFIG,
  PAY_INIT,
  ADMIN,
  SCHEDULE
};
