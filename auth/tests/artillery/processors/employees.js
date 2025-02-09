const artillery = require('@pe/artillery-kit').ArtilleryTest;
const {EMPLOYEES} = require('../constants');

function defineVariables(context, events, done) {
  context.vars.emailNew = artillery.helper.faker.internet.email();
  context.vars.groupName = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });
  context.vars.businessId = EMPLOYEES.businessId;
  context.vars.employeeId = EMPLOYEES.employeeId;
  context.vars.groupId = EMPLOYEES.groupId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
