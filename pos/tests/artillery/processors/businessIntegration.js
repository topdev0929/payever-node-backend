const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.BUSINESS_INTEGRATION.businessId;
  context.vars.integrationName = constants.BUSINESS_INTEGRATION.integrationName;
  context.vars.category = constants.BUSINESS_INTEGRATION.category;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
