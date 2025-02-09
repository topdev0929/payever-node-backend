const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.templateId = `e38f2057-f5a5-415d-b6fb-e797170d9aa1`;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  defineVariables,
  enableBusiness: artillery.helper.enableBusiness,
};
