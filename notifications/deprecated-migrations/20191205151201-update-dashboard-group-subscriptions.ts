import { subscriptionGroupsFixture } from '../fixtures/subscription-groups.fixture';

const subscriptionGroupsCollection = 'subscriptiongroups';

async function up(db) {
  for (const fixture of subscriptionGroupsFixture) {
    const existing: Array<{}> = await db._find(subscriptionGroupsCollection, { _id: fixture._id });

    if (!existing.length) {
      fixture.createdAt = new Date();
      fixture.createdAt = new Date();
      await db.insert(subscriptionGroupsCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
