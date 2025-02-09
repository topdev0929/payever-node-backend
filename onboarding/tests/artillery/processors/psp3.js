const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');
const { organizationAuth } = require('../organizationAuth')
const { enableBusiness } = require('../enableBusiness')
function defineVariables(context, events, done) {
    context.vars.name = constants.TEMPLATE.name;
    context.vars.businessId = constants.DEFAULT.businessId;
    context.vars.adminAccessToken = constants.DEFAULT.adminAccessToken;
    context.vars.clientId = constants.DEFAULT.client_id;
    context.vars.clientSecret = constants.DEFAULT.client_secret;
    context.vars.newMail = artillery.helper.faker.random.alpha({ count: 8 }) + '@do.com'
    context.vars.paymentMethod = artillery.helper.faker.random.alpha({ count: 2 })

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    oauth: artillery.helper.oauth,
    defineVariables,
    organizationAuth,
    enableBusiness,
};
