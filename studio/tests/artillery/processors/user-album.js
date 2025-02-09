const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.USER_MEDIA.businessId;
  context.vars.albumName = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.attributeId = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.attributeValue = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
