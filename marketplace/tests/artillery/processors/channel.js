const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.CHANNEL.businessId;
  context.vars.channelType = constants.CHANNEL.channelType;
  context.vars.channelId = constants.CHANNEL.channelId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
