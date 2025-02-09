const { CONFIG } = require('./constants');
const { ArtilleryTest: artillery } = require('@pe/artillery-kit');
const constants = require('./constants');

function defineVariables (context, _events, done) {
  for (const [_, constant] of Object.entries(constants)) {
    for (const [key, value] of Object.entries(constant)) {
      context.vars[key] = value;
    }
  }

  for (const [key, value] of Object.entries(constants.CONFIG.variables)) {
    context.vars[key] = value;
  }

  context.vars.randomName = (Math.random() + 1).toString(36).substring(7);
  context.vars.randomName2 = (Math.random() + 1).toString(36).substring(7);
  context.vars.legacyId = Math.floor(Math.random() * 1000);
  context.vars.legacyId2 = Math.floor(Math.random() * 1000);

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables: defineVariables,
};
