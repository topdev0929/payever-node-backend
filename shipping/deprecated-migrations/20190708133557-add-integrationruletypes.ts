import { integrationruletypesFixture } from '../fixtures/integrationruletypes.fixture';

const integrationruletypesCollection = 'integrationruletypes';

async function up(db) {
  try {
    await db.createCollection(integrationruletypesCollection);
  } catch (e) { }
  for (const fixture of integrationruletypesFixture) {
    const existing: Array<{}> = await db._find(integrationruletypesCollection, { name: fixture.name });
    if (!existing.length) {
      await db.insert(integrationruletypesCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
