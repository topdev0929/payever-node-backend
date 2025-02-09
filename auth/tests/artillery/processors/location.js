const artillery = require('@pe/artillery-kit').ArtilleryTest;

function defineVariables(context, events, done) {

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables
};
