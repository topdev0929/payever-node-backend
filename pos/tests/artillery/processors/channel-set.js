const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.CHANNEL_SET.businessId;
  context.vars.channelType = constants.CHANNEL_SET.channelType;
  context.vars.channelSetId = constants.CHANNEL_SET.channelSetId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
