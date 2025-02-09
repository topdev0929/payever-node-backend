const DASHBOARD = {
  businessId: '79e1dc00-76f3-4744-8438-d23b45a6e6d3',
  dashboardId: '7403656e-7065-4714-a2ed-4485a4b05852',
  widgetId: '7403656e-7065-4714-a2ed-4485a4b05853',
  widgetType: 'transactions',
};

const ADMIN = {
  id: '7403656e-7065-4714-a2ed-4485a4b05859',
  widgetSettingsType: 'granularity',
}

const CONFIG = {
  target: 'https://statistics-backend.staging.devpayever.com',
  variables: {
    authUrl: 'https://auth.staging.devpayever.com',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
  },
  configFile: `${__dirname}/processors/config.js`,
  http: {
    timeout: 15,
  }

};
module.exports = {
  CONFIG,
  DASHBOARD,
  ADMIN,
};