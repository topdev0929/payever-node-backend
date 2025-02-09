const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.BUSINESS_SHIPPING_SETTINGS.businessId;
    context.vars.shippingOriginId = constants.BUSINESS_SHIPPING_SETTINGS.shippingOriginId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
