const artillery = require('@pe/artillery-kit').ArtilleryTest;

function defineVariables(context, events, done) {
  context.vars.microId = artillery.helper.faker.random.uuid();

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
