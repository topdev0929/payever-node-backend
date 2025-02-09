import { IntegrationAccessFixture } from '../fixtures/integration-accesses.fixture';

async function up(db: any): Promise<any> {
  for (const access of IntegrationAccessFixture) {
    await db._run(
      'update',
      'integrationaccesses',
      {
        options: { upsert: true },
        query: { _id: access._id },
        update: { $set: access },
      },
    );
  }

  return null;
}

async function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
