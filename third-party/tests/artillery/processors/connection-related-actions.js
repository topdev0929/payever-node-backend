const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.action = constants.CONNECTION_RELATED_ACTIONS.action;
  context.vars.connectionId = constants.CONNECTION_RELATED_ACTIONS.connectionId;
  context.vars.businessId = constants.CONNECTION_RELATED_ACTIONS.businessId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
