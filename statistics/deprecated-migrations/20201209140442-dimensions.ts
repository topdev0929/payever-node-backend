import { dimensionsFixture } from '../fixtures/dimensions.fixture';

const dimensionsCollection = 'dimensions';

async function up(db) {
  for (const fixture of dimensionsFixture) {
    const existing: Array<{}> = await db._find(dimensionsCollection, { _id: fixture._id });

    if (!existing.length) {
      await db.insert(dimensionsCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
