const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.STREAM_MEDIA.businessId;
    context.vars.subscriptionMediaId = constants.STREAM_MEDIA.subscriptionMediaId;
    context.vars.userMediaId = constants.STREAM_MEDIA.userMediaId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
