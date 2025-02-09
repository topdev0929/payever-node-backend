const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.category = constants.BUSINESS_CONNECTIONS.category;
  context.vars.integrationName = constants.BUSINESS_CONNECTIONS.integrationName;
  context.vars.businessId = constants.BUSINESS_CONNECTIONS.businessId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
