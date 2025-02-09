const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.DEFAULT.businessId;
    context.vars.authorizationId = constants.DEFAULT.authorizationId;
    context.vars.transactionId = constants.DEFAULT.transactionId;
    context.vars.originalId = constants.DEFAULT.originalId;
    context.vars.action = constants.DEFAULT.action;
    context.vars.reference = constants.DEFAULT.reference;
    context.vars.sku = 'test-' + artillery.helper.faker.random.alpha({ count: 8 });

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
