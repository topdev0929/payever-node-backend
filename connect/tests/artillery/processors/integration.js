const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.category = constants.INTEGRATION.category;
  context.vars.integrationName = artillery.helper.faker.random.alpha({ count: 16 });

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
