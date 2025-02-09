const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.currencyCode = constants.CURRENCY.currencyCode;
  context.vars.categoryId = constants.ADMIN_CATEGORIES.categoryId

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
