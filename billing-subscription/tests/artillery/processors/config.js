const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const { enableBusiness } = require('../enableBusiness')
async function defineVariables(context, _, done) {
  context.vars.connectionId = constants.CONNECTION_API.connectionId
  context.vars.productId = constants.PLAN.productId;
  context.vars.domainName = artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.integrationName = constants.INTEGRATION.integrationName;
  context.vars.category = constants.INTEGRATION.category;
  context.vars.newProductId = constants.PRODUCT.newProductId;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  defineVariables,
  enableBusiness,
};
