import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {
  for (const fixture of thirdPartiesFixture) {
    const existing: Array<{}> = await db._find(thirdpartiesCollection, { _id: fixture._id });

    if (!existing.length) {
      await db.insert('thirdparties', fixture);
    }
    else {
      await db._run(
        'update',
        thirdpartiesCollection,
        {
          query: { _id: fixture._id },
          update: { $set: { url: fixture.url, handshakeRequired: fixture.handshakeRequired } },
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
