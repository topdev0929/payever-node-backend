
const integrationsCollection = 'integrations';

async function up(db) {
  await db._run(
    'update',
    integrationsCollection,
    {
      query: {},
      update: { $set: { enabled: true } },
      options: { multi: true },
    },
  );

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
