const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
  context.vars.authUrl = constants.CONFIG.variables.authUrl;
  context.vars.ruleId = constants.RULES.ruleId
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
