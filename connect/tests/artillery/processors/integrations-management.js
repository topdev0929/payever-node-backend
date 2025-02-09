const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.id = constants.INTEGRATIONS_MANAGEMENT.id;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
