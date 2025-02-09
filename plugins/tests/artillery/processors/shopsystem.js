const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.SHOPSYSTEM.businessId;
    context.vars.channelType = constants.SHOPSYSTEM.channelType;
    context.vars.shopSystemId = constants.SHOPSYSTEM.shopSystemId;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
