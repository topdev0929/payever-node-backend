const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.DASHBOARD.businessId;
    context.vars.dashboardId = constants.DASHBOARD.dashboardId;
    context.vars.widgetId = constants.DASHBOARD.widgetId;
    context.vars.widgetType = constants.DASHBOARD.widgetType;
    context.vars.widgetSettingsType = constants.ADMIN.widgetSettingsType;
    context.vars.id = constants.ADMIN.id;

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
