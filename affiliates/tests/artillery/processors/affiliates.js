const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  
  context.vars.businessId = constants.AFFILIATES.businessId;
  context.vars.firstName = artillery.helper.faker.name.firstName();
  context.vars.lastName = artillery.helper.faker.name.lastName();
  context.vars.email = artillery.helper.faker.internet.email();
  context.vars.accountHolder = artillery.helper.faker.finance.accountName();
  context.vars.accountNumber = artillery.helper.faker.finance.account();
  context.vars.bankName = artillery.helper.faker.datatype.string();
  context.vars.city = artillery.helper.faker.address.city();
  context.vars.country = artillery.helper.faker.address.country();
  context.vars.favicon = artillery.helper.faker.image.image();
  context.vars.logo = artillery.helper.faker.image.image();
  context.vars.isDeafult = artillery.helper.faker.datatype.boolean();
  context.vars.brandingName = artillery.helper.faker.datatype.string();
  context.vars.assets = artillery.helper.faker.datatype.number();
  context.vars.appliesTo = constants.AFFILIATES.appliesTo;
  context.vars.categories = artillery.helper.faker.datatype.array();
  context.vars.comission = artillery.helper.faker.datatype.array();
  context.vars.comissionType = constants.AFFILIATES.comissionType;
  context.vars.cookie = artillery.helper.faker.datatype.number();
  context.vars.currency = artillery.helper.faker.finance.currencyName();
  context.vars.defaultComission = artillery.helper.faker.datatype.number();
  context.vars.inviteLink = artillery.helper.faker.internet.url();
  context.vars.startedAt = artillery.helper.faker.datatype.datetime();
  context.vars.programName = artillery.helper.faker.datatype.string();
  context.vars.products = artillery.helper.faker.datatype.array();
  context.vars.programApi = artillery.helper.faker.datatype.string();
  context.vars.status = constants.AFFILIATES.status;
  context.vars.url = artillery.helper.faker.internet.url();
  context.vars.domainName = constants.AFFILIATES.domainName;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
