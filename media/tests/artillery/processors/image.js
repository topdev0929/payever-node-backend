const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const fs = require('fs');
const FormData = require('form-data');

function addMultipartFormData(requestParams, context, ee, next) {
    const form = new FormData();
    form.append('files', fs.createReadStream(__dirname + '/resources/img.png'));
    requestParams.body = form;
    return next(); 
}

function defineVariables(context, events, done) {
  context.vars.businessId = constants.IMAGE.businessId;
  context.vars.container = constants.IMAGE.container;
  context.vars.blobName = constants.IMAGE.blobName;
  context.vars.userId = constants.IMAGE.userId;

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
  addMultipartFormData
};
