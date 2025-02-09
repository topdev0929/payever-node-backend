const artillery = require('@pe/artillery-kit').ArtilleryTest;
const {API} = require('../constants');

function defineVariables(context, events, done) {
  context.vars.email = API.email;
  context.vars.plainPassword = API.plainPassword;
  context.vars.emailNew = artillery.helper.faker.internet.email();
  context.vars.firstNameNew = artillery.helper.faker.name.firstName();
  context.vars.lastNameNew = artillery.helper.faker.name.lastName();
  context.vars.logoId = artillery.helper.faker.random.uuid();
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
