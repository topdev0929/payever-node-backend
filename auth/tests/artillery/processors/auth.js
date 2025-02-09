const artillery = require('@pe/artillery-kit').ArtilleryTest;
const {AUTH} = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = AUTH.businessId;
  context.vars.userId = AUTH.userId;
  context.vars.appCode =AUTH.appCode;
  return done();
}



module.exports = {
  auth: artillery.helper.auth,
  defineVariables
};
