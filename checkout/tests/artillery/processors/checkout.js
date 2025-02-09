const artillery = require('@pe/artillery-kit').ArtilleryTest;
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.checkoutName = `Test checkout ${artillery.helper.faker.random.alpha({ count: 16 })}`;

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

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  defineCheckoutId,
  ...functions
};
