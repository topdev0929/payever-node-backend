const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.DASHBOARD.businessId;
    context.vars.authUrl = 'https://auth.staging.devpayever.com';
    context.vars.email = env.ARTILLERY_EMAIL;
    context.vars.plainPassword = env.ARTILLERY_PASS;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};