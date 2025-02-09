const artillery = require('@pe/artillery-kit').ArtilleryTest;
const { CONFIG } = require('../constants');

function defineVariables(context, events, done) {
  for (const [key, value] of Object.entries({
    ...CONFIG.variables,
  })) {
    context.vars[key] = value;
  }

  let lastUuid = artillery.helper.faker.datatype.uuid();
  Object.defineProperties(context.vars, {
    now: {
      get() {
        return new Date();
      },
    },
    newUuid: {
      get() {
        lastUuid = artillery.helper.faker.datatype.uuid();

        return lastUuid;
      }
    },
    uuid: {
      get() {
        return lastUuid;
      }
    },
  });

  return done();
}


function printStatus (requestParams, response, context, ee, next) {
  if(![200, 201, 204].includes(response.statusCode)) {
    console.log(response.url,response.body);  
  }
  return next();
}


module.exports = {
  enableBusiness: artillery.helper.enableBusiness,
  defaultDefineVariables: defineVariables,
  printStatus,
  auth: artillery.helper.auth,
};

