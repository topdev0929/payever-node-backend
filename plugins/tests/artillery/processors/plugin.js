const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.pluginId = constants.PLUGIN.pluginId;
  context.vars.channelType = constants.PLUGIN.channelType;

  return done();
}
module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
