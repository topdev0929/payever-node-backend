const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.category = constants.BUSINESS_INTEGRATION.category;

  return done();
}

function defineIntegrationName(requestParams, response, context, ee, next) {
  const body = JSON.stringify(response.body)
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
  defineIntegrationName,
  ...functions,
};
