const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.currencyCode = constants.CURRENCY.currencyCode;
  context.vars.integrationId = constants.ADMIN_INTEGRATIONS.integrationId

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
