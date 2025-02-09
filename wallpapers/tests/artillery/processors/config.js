const { config } = require('../constants');
const artillery = require('@pe/artillery-kit').ArtilleryTest;

function defineVariables (context, _events, done) {
  for (const [key, value] of Object.entries(config.variables)) {
    context.vars[key] = value;
  }

  return done();
}


module.exports = {
  defaultDefineVariables: defineVariables,
};