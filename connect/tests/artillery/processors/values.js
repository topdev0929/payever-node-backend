const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
