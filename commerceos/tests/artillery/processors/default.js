/* eslint-disable */
const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.sectionName = constants.DEFAULT.sectionName;
  context.vars.businessStepId = constants.DEFAULT.businessStepId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
