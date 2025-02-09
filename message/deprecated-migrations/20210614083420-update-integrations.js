const { integrationsFixture } = require('../fixtures/integrations.fixture');

module.exports.up = async (db) => {
  for (const integration of integrationsFixture) {
    await db._run(
      'update',
      'integrations',
      {
        query: { _id: integration._id },
        update: integration,
        options: {
          upsert: true,
        }
      }
    )
  }
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
