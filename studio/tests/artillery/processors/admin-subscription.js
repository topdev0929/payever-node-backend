const artillery = require('@pe/artillery-kit').ArtilleryTest;

function defineVariables(context, events, done) {
  context.vars.attributeId = artillery.helper.faker.random.uuid();
  context.vars.attributeValue = artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.subscriptionName = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.subscriptionUrl = artillery.helper.faker.internet.url();

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
