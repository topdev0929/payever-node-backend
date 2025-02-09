const CHANNEL = {
  channelType: 'site',
};

const CHANNEL_SET = {
  channelType: 'site',
  channelSetId: '90924e11-a5f9-480a-96b7-b12715e77a4d',
};

const DEFAULT = {
  applicationId: '9b34d658-18df-40f4-8046-664903453498',
  variant: 'front',
};

const SITE = {
  domain: 'artillery-test.test.payever.site',
};

const CONFIG = {
  configFile: `../processor.js`,
  target: 'https://site-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
    businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
    defaultSiteId: '9b34d658-18df-40f4-8046-664903453498',
    themeId: '337e5b1c-58c8-4d8f-8ffe-d2ef6a54bfd6',
  },
  http: {
    timeout: 15,
  },
  phases: {
    durantion: 1,
    arrivalRate: 1
  }
};

module.exports = {
  CONFIG,
  CHANNEL,
  CHANNEL_SET,
  DEFAULT,
  SITE,
};
