const { CONFIG } = require("../constants");

const artillery = require("@pe/artillery-kit").ArtilleryTest;

function defineVariables(context, event, done) {
  for (const [key, value] of Object.entries(CONFIG.variables)) {
    context.vars[key] = value;
  }

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables: defineVariables,
};
