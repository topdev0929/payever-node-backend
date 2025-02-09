const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.action = constants.INTEGRATION_RELATED_ACTIONS.action;
  context.vars.integrationName = constants.INTEGRATION_RELATED_ACTIONS.integrationName;
  context.vars.businessId = constants.INTEGRATION_RELATED_ACTIONS.businessId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
