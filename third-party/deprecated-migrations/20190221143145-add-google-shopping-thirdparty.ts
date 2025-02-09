import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {
  const fixture = thirdPartiesFixture.filter(m => m.name === 'google_shopping')[0];
  const existing: Array<{}> = await db._find(thirdpartiesCollection, { _id : fixture._id });
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
