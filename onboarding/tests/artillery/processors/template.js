const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const { enableBusiness } = require('../enableBusiness')

function defineVariables(context, events, done) {
    context.vars.businessId = constants.DEFAULT.businessId;
    context.vars.name = constants.TEMPLATE.name;
    context.vars.adminAccessToken = constants.DEFAULT.adminAccessToken;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
    enableBusiness,
};
