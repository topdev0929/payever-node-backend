const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

module.exports = {
    auth: artillery.helper.auth,
    enableBusiness: artillery.helper.enableBusiness
};
