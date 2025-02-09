const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.channelSetId = constants.CHANNEL_SET.channelSetId;
    context.vars.shippingOrderId = constants.CHANNEL_SET.shippingOrderId;
    context.vars.methodId = artillery.helper.faker.random.uuid();

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
