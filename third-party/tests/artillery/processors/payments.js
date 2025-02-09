const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.PAYMENTS.businessId;
    context.vars.integrationName = constants.PAYMENTS.integrationName;
    context.vars.paymentOptionId = constants.PAYMENTS.paymentOptionId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
