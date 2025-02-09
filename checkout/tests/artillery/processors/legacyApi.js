const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.clientId = constants.LEGACY_API.clientId;
  context.vars.clientSecret = constants.LEGACY_API.clientSecret;
  context.vars.paymentId = constants.LEGACY_API.paymentId;
  context.vars.channelSetId = constants.LEGACY_API.channelSetId;

  return done();
}

function defineApiCallId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body)
  if (body && body.call) {
    context.vars.apiCallId = body.call.id;
  }

  return next();
}

module.exports = {
  auth: artillery.helper.auth,
  oauth: artillery.helper.oauth,
  defineVariables,
  defineApiCallId,
  ...functions
};
