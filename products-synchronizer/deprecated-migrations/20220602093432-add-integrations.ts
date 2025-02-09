import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

async function up(db) {
  for (const fixture of integrationsFixture) {
    const existing: Array<{}> = await db._find(integrationsCollection, {
      name: fixture.name,
    });

    if (!existing.length) {
      await db.insert('integrations', fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
