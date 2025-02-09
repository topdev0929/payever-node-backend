const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.recordId = constants.RECORD.recordId;
  context.vars.flowId = constants.RECORD.flowId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
