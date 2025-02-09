const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('./constants');

function defineVariables(context, events, done) {
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

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
};
