const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.USER_SUBSCRIPTION.businessId;
  context.vars.subscriptionName = constants.USER_SUBSCRIPTION.subscriptionName;
  context.vars.subscriptionId = constants.USER_SUBSCRIPTION.subscriptionId;
  context.vars.attributeId = constants.USER_SUBSCRIPTION.attributeId;
  context.vars.attributeValue = constants.USER_SUBSCRIPTION.attributeValue;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
