const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.app = constants.NOTIFICATION.app;
  context.vars.kind = constants.NOTIFICATION.kind;
  context.vars.entity = constants.NOTIFICATION.entity;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
