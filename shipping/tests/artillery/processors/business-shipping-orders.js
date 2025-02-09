const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.BUSINESS_SHIPPING_ORDERS.businessId;
    context.vars.shippingOrderId = constants.BUSINESS_SHIPPING_ORDERS.shippingOrderId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
