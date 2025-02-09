import { pluginsFixture } from '../fixtures/plugins.fixture';

const pluginsCollection = 'plugins';

async function up(db) {
  console.log(db);
  for (const fixture of pluginsFixture) {
    const existing: Array<{}> = await db._find(pluginsCollection, { channel : fixture.channel });
    console.log(existing);
    if (!existing.length) {
      await db.insert(pluginsCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
