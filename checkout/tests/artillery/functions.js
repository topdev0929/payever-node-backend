
function setAccessToken(requestParams, response, context, ee, next) {
    const body = JSON.stringify(response.body)
    context.vars.accessToken = body.accessToken;

    return next();
}

module.exports = {
    setAccessToken
}