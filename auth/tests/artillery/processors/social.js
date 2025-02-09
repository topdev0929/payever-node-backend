const artillery = require('@pe/artillery-kit').ArtilleryTest;
const {SOCIAL} = require('../constants');

function defineVariables(context, events, done) {
  context.vars.socialId = SOCIAL.socialId;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables
};
