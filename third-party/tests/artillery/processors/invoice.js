const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.INVOICE.businessId;
    context.vars.integrationName = constants.INVOICE.integrationName;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
