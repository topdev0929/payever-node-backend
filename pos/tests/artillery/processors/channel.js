const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.CHANNEL.businessId;
  context.vars.channelType = constants.CHANNEL.channelType;
  context.vars.legacyId = artillery.helper.faker.random.number({ 'min': 1000, 'max': 10000 });
  context.vars.legacyIdUpdate = artillery.helper.faker.random.number({ 'min': 1000, 'max': 10000 });

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
