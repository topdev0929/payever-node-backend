const artillery = require('@pe/artillery-kit').ArtilleryTest;
const functions = require('../functions');


function defineChannelSetId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const channelSet = (body || [])[0];

  if (channelSet) {
    context.vars.channelSetId = channelSet.id;
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
  defineChannelSetId,
  defineIntegrationName,
  ...functions
};
