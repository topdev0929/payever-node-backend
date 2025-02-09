import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection = 'integrations';

async function up(db) {
  const hermes = integrationsFixture.find(x => x.name === 'hermes');
  const ups = integrationsFixture.find(x => x.name === 'ups');

  await db._run(
    'update',
    integrationsCollection,
    {
      query: { _id: hermes._id },
      update: { $set: { installationOptions: hermes.installationOptions } },
      options: {},
    },
  );

  await db._run(
    'update',
    integrationsCollection,
    {
      query: { _id: ups._id },
      update: { $set: { installationOptions: ups.installationOptions } },
      options: {},
    },
  );

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
