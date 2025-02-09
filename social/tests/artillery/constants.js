const BUSINESS_ID = "15278f88-9439-4ca5-a214-40b1cbc36ba7";

const CONFIG = {
  target: "https://social-backend.test.devpayever.com",
  variables: {
    authUrl: "https://auth.test.devpayever.com",
    email: "artillery@payever.de",
    emailAdmin: "artillery-admin@payever.de",
    plainPassword: "Payever123!",
    businessId: BUSINESS_ID,
  },
};

module.exports = {
  BUSINESS_ID,
  CONFIG,
};
