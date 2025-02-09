const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.channelSetId = constants.ADMIN.channelSetId;

  return done();
}

function defineCheckoutId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const checkout = (body || [])[0];
  if (checkout) {
    context.vars.checkoutId = checkout._id;
  }

  return next();
}

function defineIntegrationName(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const integration = (body || [])[0];
  if (integration && integration.integration) {
    context.vars.integrationName = integration.integration.name;
  } else if (typeof integration === 'string' || integration instanceof String) {
    context.vars.integrationName = integration;
  }

  return next();
}


module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  defineCheckoutId,
  defineIntegrationName,
  ...functions
};
