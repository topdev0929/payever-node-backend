import { sectionsFixture } from '../fixtures/sections.fixture';

const sectionsCollection = 'checkoutsections';

async function up(db) {
  for (const fixture of sectionsFixture) {
    if (fixture.code === 'shipping') {
      await db._run(
        'update',
        sectionsCollection,
        {
          query: { _id: fixture._id },
          update: { $set: { defaultEnabled: fixture.defaultEnabled } },
          options: {},
        },
      );
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
