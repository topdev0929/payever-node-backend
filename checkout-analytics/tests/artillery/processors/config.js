const artillery = require('@pe/artillery-kit').ArtilleryTest
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.flowId = constants.CHECKOUT_METRICS.flowId;
    context.vars.paymentMethod = constants.CHECKOUT_METRICS.paymentMethod;
    context.vars.type = constants.CHECKOUT_METRICS.type;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
