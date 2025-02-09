const artillery = require('@pe/artillery-kit').ArtilleryTest
const { CONFIG } = require('../constants')

function defineVariables(context, _events, done) {
    for (const [key, value] of Object.entries({
        ...CONFIG.variables
    })) {
        context.vars[key] = value;
    }


    context.vars.random = (Math.random() + 1000);
    context.vars.random2 = (Math.random() + 1000);
    context.vars.randomName = (Math.random() + 1).toString(36).substring(7);
    context.vars.randomName2 = (Math.random() + 1).toString(36).substring(7);

    return done()
}

function printStatus (requestParams, response, context, ee, next) {
	if(![200, 201, 204].includes(response.statusCode)) {
    console.log(response.url,response.body);  
  }
  return next();
}

module.exports = {
    auth: artillery.helper.auth,
    authAdmin: artillery.helper.authAdmin,
    enableBusiness: artillery.helper.enableBusiness,
    defaultDefineVariables: defineVariables,
    printStatus,
}
