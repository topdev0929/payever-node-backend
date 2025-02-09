const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
  context.vars.authUrl = constants.CONFIG.variables.authUrl;
  context.vars.reference = constants.BUSINESS.reference;
  context.vars.originalId = constants.BUSINESS.originalId;
  context.vars.uuid = constants.BUSINESS.uuid;
  context.vars.action = constants.BUSINESS.action;
  context.vars.pdf = constants.BUSINESS.pdf;
  context.vars.name = constants.BUSINESS.name;
  context.vars.paymentId = constants.BUSINESS.paymentId;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
