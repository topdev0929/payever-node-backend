const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const { enableBusiness } = require('../enableBusiness')
const fs = require('fs');
const path = require('path');
function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.testEmail = artillery.helper.faker.internet.email();
  context.vars.firstName = artillery.helper.faker.name.firstName();
  context.vars.lastName = artillery.helper.faker.name.lastName();

  return done();
}
function beforeRequest(requestParams, context, ee, next) {
  const file = fs.createReadStream(path.join(__dirname, 'data/bulk-upload.payload.csv'));
  const formData = {
    files: file
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);

  return next();
}
module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
  enableBusiness,
  beforeRequest,
};
