const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.randomName = (Math.random() + 1).toString(36).substring(7);

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  defineVariables,
  enableBusiness: artillery.helper.enableBusiness,
};
