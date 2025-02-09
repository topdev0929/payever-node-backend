const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.domain = constants.DEFAULT.domain;
  context.vars.terminalId = constants.DEFAULT.terminalId;
  context.vars.applicationId = constants.DEFAULT.applicationId;
  context.vars.variant = constants.DEFAULT.variant;
  context.vars.pageId = constants.DEFAULT.pageId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
