const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.currencyCode = constants.CURRENCY.currencyCode;
  context.vars.wrapperType = constants.INTEGRATION_WRAPPER.wrapperType

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
