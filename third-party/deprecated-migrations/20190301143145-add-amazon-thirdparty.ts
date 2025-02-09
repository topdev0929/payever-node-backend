import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {
  const fixture = thirdPartiesFixture.find(m => m.name === 'amazon');
  const existing: Array<{}> = await db._find(thirdpartiesCollection, { name : fixture.name });
  if (existing.length) {
    return null;
  }
  await db.insert('thirdparties', fixture);
  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
