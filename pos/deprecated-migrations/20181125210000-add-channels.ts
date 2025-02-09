import { channelsFixture } from '../fixtures/channels.fixture';

const channelsCollection = 'channels';

async function up(db) {
  for (const fixture of channelsFixture) {
    const existing: Array<{}> = await db._find(channelsCollection, { type : fixture.type });

    if (!existing.length) {
      fixture.createdAt = new Date();
      fixture.updatedAt = new Date();
      await db.insert(channelsCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
