const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.action = constants.OUTER_INTEGRATION_CONNECTIONS.action;
  context.vars.integrationName = constants.OUTER_INTEGRATION_CONNECTIONS.integrationName;
  context.vars.authorizationId = constants.OUTER_INTEGRATION_CONNECTIONS.authorizationId;
  context.vars.businessId = constants.OUTER_INTEGRATION_CONNECTIONS.businessId;
  context.vars.externalId = artillery.helper.faker.random.uuid();

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
