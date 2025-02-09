const CONFIG = {
  target: 'https://channels-backend.test.devpayever.com/api',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'channels.artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
    businessId: 'a0fbfbeb-86c1-4aab-b6b3-5d44519dcb4d',
    channelType: 'facebook',
    channelSetId: '9f42e02d-565a-4fa5-b7e4-b95f89caf34e',
    channelId: 'deb1ac75-7ec7-4188-bd78-858387875fbd'
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  },
  default: {
    headers: {
      'content-type': "application/json",
      'user-agent': "Artillery (https://artillery.io)",
    },
  }  
};

module.exports = {
  CONFIG
};
