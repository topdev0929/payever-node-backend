const { ArtilleryTest } = require("@pe/artillery-kit");

createAppointmentDto = {
  fields: [
    { value: "test", fieldId: ArtilleryTest.helper.faker.random.word() },
  ],
  allDay: false,
  repeat: false,
};

const CONFIG = {
  target: "https://appointments-backend.test.devpayever.com",
  variables: {
    authUrl: "https://auth.test.devpayever.com",
    businessId: "37edda36-c346-4b06-9d2c-1e17b9d22ba5",
    email: "artillery@payever.de",
    plainPassword: "Payever123!",
    createAppointmentDto: createAppointmentDto,
  },
  configFile: `${__dirname}/processors/config.js`,
};

module.exports = {
  CONFIG,
};
