const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.subscriptionProductId = constants.DEFAULT.businessId;
  context.vars.productId = artillery.helper.faker.random.uuid();

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
