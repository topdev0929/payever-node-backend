const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.BUSINESS_INTEGRATION_SUBSCRIPTIONS.businessId;
    context.vars.subscriptionId = constants.BUSINESS_INTEGRATION_SUBSCRIPTIONS.subscriptionId;
    context.vars.ruleName = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
