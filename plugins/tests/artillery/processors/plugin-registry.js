const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.commandId = constants.PLUGIN_REGISTRY.commandId;

  return done();
}
module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
