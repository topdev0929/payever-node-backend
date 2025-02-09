const artillery = require('@pe/artillery-kit').ArtilleryTest;
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.checkoutName = `Test checkout ${artillery.helper.faker.random.alpha({ count: 16 })}`;

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

function defineConnectionId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const connection = (body || [])[0];

  if (connection) {
    context.vars.connectionId = connection._id;
  }

  return next();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  defineCheckoutId,
  defineIntegrationName,
  defineConnectionId,
  ...functions
};
