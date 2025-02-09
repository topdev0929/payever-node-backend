const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.BUSINESS_SUBSCRIPTIONS.businessId;
    context.vars.integrationName = constants.BUSINESS_SUBSCRIPTIONS.integrationName;
    context.vars.category = constants.BUSINESS_SUBSCRIPTIONS.category;
    context.vars.action = constants.BUSINESS_SUBSCRIPTIONS.action;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
