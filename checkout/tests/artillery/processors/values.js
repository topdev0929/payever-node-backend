const artillery = require('@pe/artillery-kit').ArtilleryTest;
const functions = require('../functions');

function defineVariables(context, events, done) {
  return done();
}



module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  ...functions
};
