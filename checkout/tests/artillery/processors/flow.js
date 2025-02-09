const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.flowId = constants.FLOW.flowId;

  return done();
}

function defineChannelSetId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const channelSet = (body || [])[0];

  if (channelSet) {
    context.vars.channelSetId = channelSet.id;
  }

  return next();
}

function defineCheckoutId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const checkout = (body || [])[0];

  if (checkout) {
    context.vars.checkoutId = checkout._id;
  }

  return next();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  defineChannelSetId,
  defineCheckoutId,
  ...functions
};
