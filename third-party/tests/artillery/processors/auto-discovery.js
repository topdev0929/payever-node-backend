const artillery = require('@pe/artillery-kit').ArtilleryTest;
const dotenv = require('dotenv');
const constants = require('../constants');

dotenv.config();

function defineVariables(context, events, done) {
  context.vars.autoDiscoveryToken = process.env.AUTO_DISCOVERY_TOKEN || '884702ec629d8c9fa00e0bc250148f25';
  context.vars.integrationName = constants.AUTO_DISCOVERY.integrationName;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
