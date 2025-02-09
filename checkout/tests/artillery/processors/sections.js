const artillery = require('@pe/artillery-kit').ArtilleryTest;
const functions = require('../functions');

module.exports = {
  auth: artillery.helper.auth,
  ...functions
};
