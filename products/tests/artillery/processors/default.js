const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.businessId = constants.DEFAULT.businessId;
  context.vars.channelSetId = constants.DEFAULT.channelSetId;
  context.vars.collectionName = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.collectionNamePatch = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.collectionSlug = artillery.helper.faker.random.alpha({ count: 4 });
  context.vars.collectionSlugPatch = artillery.helper.faker.random.alpha({ count: 4 });
  context.vars.collectionDate = artillery.helper.faker.date.past();
  context.vars.predictTitle = artillery.helper.faker.random.alpha({ count: 16 });

  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables,
};
