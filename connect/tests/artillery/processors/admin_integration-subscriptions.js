const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.currencyCode = constants.CURRENCY.currencyCode;
  context.vars.integrationSubscriptionId = constants.ADMIN_INTEGRATION_SUBSCRIPTIONS.integrationSubscriptionId

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
