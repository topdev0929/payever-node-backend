const axios = require("axios");
const constants = require('./constants');
function enableBusiness(context, events, done) {
    return axios
        .patch(
            `${constants.CONFIG.variables.authUrl}/api/business/${context.vars.businessId}/enable`,
            {},
            {
                headers: {
                    "user-agent": "Artillery (https://artillery.io)",
                    authorization: `Bearer ${context.vars.accessToken}`,
                },
            }
        )
        .then((result) => {
            context.vars.accessToken = result.data.accessToken;
            return done();
        })
        .catch();
}

module.exports = {
    enableBusiness
}