const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.campaignId = constants.MAIL.campaignId;
  context.vars.pageId = constants.MAIL.pageId;
  context.vars.applicationId = constants.MAIL.applicationId;
  context.vars.businessId = constants.CONFIG.variables.businessId;
  context.vars.mailName = artillery.helper.faker.datatype.string();
  context.vars.screen = artillery.helper.faker.datatype.uuid();
  context.vars.productId = artillery.helper.faker.datatype.uuid();
  context.vars.trialId = artillery.helper.faker.datatype.uuid();
  context.vars.domain = artillery.helper.faker.internet.domainName();
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
};
