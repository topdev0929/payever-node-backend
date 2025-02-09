const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
    context.vars.authUrl = constants.CONFIG.variables.authUrl
    context.vars.folderId = constants.FOLDERS_BUSINESS.folderId
    context.vars.documentId = constants.FOLDERS_BUSINESS.documentId
    context.vars.locationId = constants.FOLDERS_BUSINESS.locationId
  return done();
}

module.exports = {
    auth:artillery.helper.auth,
  defineVariables,
};
