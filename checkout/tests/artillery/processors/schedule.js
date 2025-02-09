const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const functions = require('../functions');

function defineVariables(context, events, done) {
  context.vars.scheduleId = constants.SCHEDULE.scheduleId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  ...functions
};
