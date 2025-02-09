const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.action = constants.OUTER_INTEGRATION_CONNECTION_ACTIONS.action;
  context.vars.integrationName = constants.OUTER_INTEGRATION_CONNECTION_ACTIONS.integrationName;
  context.vars.authorizationId = constants.OUTER_INTEGRATION_CONNECTION_ACTIONS.authorizationId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
