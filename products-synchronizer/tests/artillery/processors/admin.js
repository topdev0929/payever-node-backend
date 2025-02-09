const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.SYNCHRONIZATION.businessId;
    context.vars.integrationId = constants.SYNCHRONIZATION.integrationId;
    context.vars.direction = constants.SYNCHRONIZATION.direction;
    context.vars.synchronizationId = constants.SYNCHRONIZATION.synchronizationId;
    context.vars.taskId = constants.SYNCHRONIZATION.taskId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
