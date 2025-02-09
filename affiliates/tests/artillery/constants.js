
const AFFILIATES = {
  appliesTo: 'ALL_PRODUCTS',
  businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
  comissionType: 'amount',
  domainName: 'example.com',
  status: 'active'
};

const CONFIG = {
  target: 'https://affiliates-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    businessId: AFFILIATES.businessId,
  },
};


module.exports = {
  AFFILIATES,
  CONFIG,
};
