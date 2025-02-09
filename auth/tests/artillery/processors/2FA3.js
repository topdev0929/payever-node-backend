const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.email = constants.TFA.email;
  context.vars.plainPassword = constants.TFA.plainPassword;

  return done();
}
module.exports = {
  defineVariables,
};
