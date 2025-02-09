import { cubesFixture } from '../fixtures/cubes.fixture';

const cubesCollection = 'cubes';

async function up(db) {
  for (const fixture of cubesFixture) {
    const existing: Array<{}> = await db._find(cubesCollection, { _id: fixture._id });

    if (!existing.length) {
      await db.insert('cubes', fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
