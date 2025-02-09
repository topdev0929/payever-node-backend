const artillery = require('@pe/artillery-kit').ArtilleryTest;
const {OAUTH} = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = OAUTH.businessId;
  context.vars.clientName = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.hashAlg = OAUTH.hashAlg
  context.vars.message = OAUTH.message
  context.vars.signature = OAUTH.signature
  context.vars.grantType = OAUTH.grantType
  context.vars.scope = OAUTH.scope
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
