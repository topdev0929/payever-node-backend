const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.TERMINAL_INTEGRATION.businessId;
  context.vars.terminalId = constants.TERMINAL_INTEGRATION.terminalId;
  context.vars.integrationName = constants.TERMINAL_INTEGRATION.integrationName;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
