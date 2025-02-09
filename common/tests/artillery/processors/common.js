const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');


function defineVariables(context, events, done) {
  context.vars.countryCode = constants.COMMON.countryCode;
  context.vars.rate = artillery.helper.faker.datatype.number({ min: 1, max: 100 });
  context.vars.description = artillery.helper.faker.lorem.words(3);
  context.vars.languages = artillery.helper.faker.datatype.array(5);
  context.vars.taxId = artillery.helper.faker.datatype.uuid();
  context.vars.legalFormId = artillery.helper.faker.datatype.uuid();
  context.vars.countryId = artillery.helper.faker.datatype.uuid();
  context.vars.continentId = artillery.helper.faker.datatype.uuid();
  context.vars.commonStorageId = artillery.helper.faker.datatype.uuid();
  context.vars.legalDocumentId = artillery.helper.faker.datatype.uuid();
  context.vars.languageId = artillery.helper.faker.datatype.uuid();
  context.vars.currencyId = artillery.helper.faker.datatype.uuid();
  context.vars.disclaimer = constants.COMMON.disclaimer;
  context.vars.capital = artillery.helper.faker.address.state();
  context.vars.continent = artillery.helper.faker.lorem.word(1);
  context.vars.currencies = artillery.helper.faker.datatype.array(5);
  context.vars.flagEmoji = artillery.helper.faker.random.alphaNumeric(10);
  context.vars.flagUnicode = artillery.helper.faker.random.alphaNumeric(10);
  context.vars.countryName = artillery.helper.faker.address.country();
  context.vars.nativeName = artillery.helper.faker.address.country();
  context.vars.phoneCode = artillery.helper.faker.datatype.number({ min: 1, max: 100 });
  context.vars.languageName = artillery.helper.faker.lorem.word(10);
  context.vars.languageEnglishName = artillery.helper.faker.lorem.word(10);
  context.vars.code = artillery.helper.faker.lorem.word(3);
  context.vars.symbol = artillery.helper.faker.lorem.word(1);
  context.vars.currencyName = artillery.helper.faker.lorem.word(10);
  context.vars.commonStorageType = artillery.helper.faker.lorem.word(10);
  context.vars.commonStorageValue = artillery.helper.faker.lorem.word(10);
  return done();
}


module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
};
