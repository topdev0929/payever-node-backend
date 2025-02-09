const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.SHIPPING.businessId;
    context.vars.integrationName = constants.SHIPPING.integrationName;
    context.vars.subscriptionId = constants.SHIPPING.subscriptionId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
