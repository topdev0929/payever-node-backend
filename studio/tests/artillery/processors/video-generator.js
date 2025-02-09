const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
    context.vars.businessId = constants.VIDEO_GENERATOR.businessId;
    context.vars.videoPath = 'test-' +artillery.helper.faker.random.alpha({ count: 8 });
    context.vars.audio = 'test-' +artillery.helper.faker.random.alpha({ count: 8 });

    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    defineVariables,
};
