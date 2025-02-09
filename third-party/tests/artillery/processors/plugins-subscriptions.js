const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.PLUGINS_SUBSCRIPTIONS.businessId;
    context.vars.integrationName = constants.PLUGINS_SUBSCRIPTIONS.integrationName;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
