const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.paymentMailId = constants.DEFAULT.paymentMailId;
  context.vars.transactionId = constants.DEFAULT.transactionId;
  context.vars.to = artillery.helper.faker.internet.email();
  context.vars.html = `<p>${artillery.helper.faker.lorem.paragraph()}</p>`;
  context.vars.subject = artillery.helper.faker.lorem.sentence();
  context.vars.data = {
    to: artillery.helper.faker.internet.email(),
    body: artillery.helper.faker.lorem.paragraph(),
    subject: artillery.helper.faker.lorem.sentence(),
    businessId: constants.DEFAULT.businessId,
  };

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  defineVariables,
  enableBusiness: artillery.helper.enableBusiness,
};
