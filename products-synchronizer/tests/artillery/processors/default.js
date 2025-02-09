const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.DEFAULT.businessId;
    context.vars.taskId = constants.DEFAULT.taskId;
    context.vars.integrationId = constants.DEFAULT.integrationId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
