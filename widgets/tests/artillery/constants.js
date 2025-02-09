const BUS_TEST = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  currency: 'EUR',
  channelSetId: '40aec6bd-3549-4f91-ad58-bcd00903fa0f',
  type: 'link',
  campaignId: '05346a29-7bc1-467d-9343-f84d8b8614b3',
  contacts: 1,
  paymentId: '9a8521e181fa3de1127141aa3653b622',
};

const CAMPAIGN = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
};

const WIDGET = {
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  widgetType: 'test-type',
  widgetIcon: 'icon',
  widgetId: 'b33845b0-9798-4980-ae0c-8585b1cef2cb',
  channelSetId: '40aec6bd-3549-4f91-ad58-bcd00903fa0f',
};

const CONFIG = {
  target: 'https://widgets-backend.test.devpayever.com',
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
  BUS_TEST,
  CAMPAIGN,
  WIDGET,
  CONFIG
};
