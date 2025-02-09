const AUTH = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  userId: '00d99cf4-c89f-4711-8c9d-8cf3b8916c89',
  appCode: 'users'
};

const TFA = {
  email: 'artillery@payever.de',
  plainPassword: 'Payever123!',
};

const ORGANIZATION = {
  organizationId: '34b8485c-1c4f-4797-b41b-74e796760ae4',
};

const PARTNER = {
  userId: '00d99cf4-c89f-4711-8c9d-8cf3b8916c89',
  tagName: 'santander',
};

const SOCIAL = {
  socialId:'104698661069108589615'
};


const EMPLOYEES = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  employeeId: '02a6434b-12c9-499f-a69d-d40b47312f93',
  groupId: '9b9f8a90-6d8b-4602-9347-4670dc4a5d1e'
};

const OAUTH = {
  businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  hashAlg: 'md5',
  message: 'test',
  signature: '098f6bcd4621d373cade4e832627b4f6',
  grantType: 'http://www.payever.de/api/payment',
  scope: 'API_CREATE_PAYMENT'
};

const DEFAULT = {
  email: 'artillery@payever.de',
};
const API = {
  email: 'testcases@payever.de',
  plainPassword: 'Payever123!'
};

const CONFIG = {
  target: 'https://auth.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
  },
  http: {
    timeout: 15,
  }
};

module.exports = {
  AUTH,
  TFA,
  PARTNER,
  EMPLOYEES,
  OAUTH,
  DEFAULT,
  CONFIG,
  API,
  SOCIAL,
  ORGANIZATION
};
