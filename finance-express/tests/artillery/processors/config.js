const constants = require('../constants');
const artillery = require('@pe/artillery-kit').ArtilleryTest;

function defineVariables(context, events, done) {
  for (const [key, value] of Object.entries({
    ...constants.CONFIG.variables,
    ...constants.WIDGETS_VARS,
    ...constants.CHANNEL_VARS
    
  })) {
    context.vars[key] = value;
  }

  return done();
}

function defineChannelSetId(requestParams, response, context, ee, next) {
  const body = response.body;

  context.vars.channelSetId = body._id ?? constants.CHANNEL_VARS.channelSetId;

  return next();
}

function defineChannelId(requestParams, response, context, ee, next) {
  const body = response.body;

  context.vars.channelId = body._id ?? constants.CHANNEL_VARS.channelId;

  return next();
}

function defineWidgetId(requestParams, response, context, ee, next) {
  const body = response.body;

  context.vars.widgetId = body._id ?? constants.WIDGETS_VARS.widgetId;

  return next();
}

module.exports = {
  auth: artillery.helper.auth,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
  defineChannelSetId,
  defineChannelId,
  defineWidgetId
};