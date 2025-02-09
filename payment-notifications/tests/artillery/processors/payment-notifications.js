const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  const ids = constants.CALLBACK.apiCallId;

  context.vars.apiCallId = ids[Math.floor(Math.random() * ids.length)];

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
