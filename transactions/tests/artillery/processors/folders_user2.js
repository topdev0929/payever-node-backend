const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
function defineVariables(context, events, done) {
    context.vars.authUrl = constants.CONFIG.variables.authUrl
    context.vars.folderId = constants.FOLDERS_USER.folderId
    context.vars.documentId = constants.FOLDERS_USER.documentId
    context.vars.locationId = constants.FOLDERS_USER.locationId
    context.vars.userId = constants.FOLDERS_USER.userId


    context.vars.parentFolderId = constants.FOLDER_DATA.parentFolderId;
    context.vars.isHeadline = constants.FOLDER_DATA.isHeadline;
    context.vars.image = constants.FOLDER_DATA.image;
    context.vars.name = constants.FOLDER_DATA.name;
    context.vars.description = constants.FOLDER_DATA.description;
    context.vars.isProtected = constants.FOLDER_DATA.isProtected;
    context.vars.position = constants.FOLDER_DATA.position


  return done();
}

module.exports = {
    auth:artillery.helper.auth,
  defineVariables,
};
