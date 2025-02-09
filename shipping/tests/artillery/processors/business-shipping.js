const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.BUSINESS_SHIPPING.businessId;
    context.vars.integrationName = constants.BUSINESS_SHIPPING.integrationName;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
