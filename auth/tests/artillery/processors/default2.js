const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.email = constants.DEFAULT.email;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables
};
