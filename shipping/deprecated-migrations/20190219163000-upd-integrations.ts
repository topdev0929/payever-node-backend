import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection = 'integrations';

async function up(db) {
  for (const fixture of integrationsFixture) {
    await db._run(
      'update',
      integrationsCollection,
      {
        query: { _id: fixture._id },
        update: fixture,
        options: {},
      },
    );
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
