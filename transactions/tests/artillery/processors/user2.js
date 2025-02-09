const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
  context.vars.authUrl = constants.CONFIG.variables.authUrl;
  context.vars.userId = constants.USER.userId;
  context.vars.uuid = constants.USER.uuid;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
