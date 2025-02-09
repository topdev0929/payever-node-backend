import { metricsFixture } from '../fixtures/metrics.fixture';

const metricsCollection = 'metrics';

async function up(db) {
  try {
    await db.dropCollection(metricsCollection);
  } catch { }
  for (const fixture of metricsFixture) {
    const existing: Array<{}> = await db._find(metricsCollection, { _id: fixture._id });

    if (!existing.length) {
      await db.insert(metricsCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
