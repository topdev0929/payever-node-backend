const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.merchantId = constants.DEFAULT.merchantId;
  context.vars.channelSetId = constants.DEFAULT.channelSetId;
  context.vars.paymentCode = constants.DEFAULT.paymentCode;
  context.vars.terminalId = constants.DEFAULT.terminalId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  oauth: artillery.helper.oauth,
  defineVariables,
};
