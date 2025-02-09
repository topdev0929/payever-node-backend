const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.userId = constants.PARTNER.userId;
  context.vars.tagName = constants.PARTNER.tagName;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
