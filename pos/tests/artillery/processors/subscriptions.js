const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.SUBSCRIPTIONS.businessId;
  context.vars.appName = constants.SUBSCRIPTIONS.appName;
  context.vars.productId = artillery.helper.faker.random.uuid();
  context.vars.trialId = artillery.helper.faker.random.uuid();

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
