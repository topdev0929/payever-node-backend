const BLOG = {
  blogId: '52cf224e-fff6-4beb-a0f6-6da5b31a9508',
  channelType: 'blog',
  channelSetId: '2862ef91-9772-4807-83c2-5c451cec42c1',
  domain: 'artillery-test'
};

const CONFIG = {
  configFile: `../processor.js`,
  // target: 'https://blog-backend.test.devpayever.com',
  target: 'http://localhost:3015',
  variables: {
    // authUrl: 'https://auth.test.devpayever.com',
    authUrl: 'http://localhost:3008',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
    businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
    defaultBlogId: '52cf224e-fff6-4beb-a0f6-6da5b31a9508',
    themeId: '5515612a-8cb3-4784-b2ca-34496196f318',
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
  BLOG,
};
