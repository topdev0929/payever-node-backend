const artillery = require('@pe/artillery-kit').ArtilleryTest;

const fakerUuid = artillery.helper.faker.datatype.uuid();
const fakerRandomAlpha = artillery.helper.faker.random.alpha({ count: 8 });
const { auth: helperAuth } = artillery.helper;

const businessId = '15278f88-9439-4ca5-a214-40b1cbc36ba7';

const config = {
  target: 'https://wallpapers-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    businessId,
    businessProductsId: businessId,
    wallpaper: fakerUuid,
    wallpaperActive: fakerUuid,
    productCode: `test-${fakerRandomAlpha}`,
    conditions: [{ searchText: 'some string', contains: 0, filter: 'some string' }],
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
  },
};

module.exports = {
  config,
  helperAuth,
};
