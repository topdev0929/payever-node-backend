/* eslint-disable */
const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.microUuid = constants.PERSONAL_APPS.microUuid;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
