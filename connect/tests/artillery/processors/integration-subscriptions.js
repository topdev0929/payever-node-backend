const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.INTEGRATION_SUBSCRIPTIONS.businessId;
  context.vars.integrationName = constants.INTEGRATION_SUBSCRIPTIONS.integrationName;
  context.vars.category = constants.INTEGRATION_SUBSCRIPTIONS.category;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
