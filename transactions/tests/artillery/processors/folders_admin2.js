const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
    context.vars.authUrl = constants.CONFIG.variables.authUrl
    context.vars.folderId = constants.FOLDERS_ADMIN.folderId
  return done();
}

module.exports = {
    auth:artillery.helper.auth,
  defineVariables,
};
