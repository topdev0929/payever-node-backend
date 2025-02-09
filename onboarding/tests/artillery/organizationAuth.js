const axios = require("axios");
const constants = require('./constants');
function organizationAuth(context, events, done) {
    return axios
        .post(
            `${constants.CONFIG.variables.authUrl}/api/organizations/token`,
            {
                clientId: context.vars.clientId,
                clientSecret: context.vars.clientSecret
            },
            {
                headers: {
                    "user-agent": "Artillery (https://artillery.io)",
                    authorization: `Bearer ${context.vars.accessToken}`,
                },
            }
        )
        .then((result) => {
            context.vars.organizationAccessToken = result.data.accessToken;
            return done();
        })
        .catch();
}

module.exports = {
    organizationAuth
}