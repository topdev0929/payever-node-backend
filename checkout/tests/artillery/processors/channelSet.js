const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.checkoutName = `Test checkout ${artillery.helper.faker.random.alpha({ count: 16 })}`;
  context.vars.type = constants.CHANNEL_SET.type;

  return done();
}

function defineCheckoutId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body)
  if(!body.error){
    context.vars.checkoutId = body._id
  }else{
    context.vars.checkoutId = '8dae4c51-cf8d-42a0-8a92-482e86851eff'
  }

  return next()
}

function defineChannelSetId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  const channelSet = (body || [])[0];

  if (channelSet) {
    context.vars.channelSetId = channelSet.id;
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
