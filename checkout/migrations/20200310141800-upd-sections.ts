import { sectionsFixture } from '../fixtures/sections.fixture';

const sectionsCollection: string = 'checkoutsections';

async function up(db: any): Promise<void> {
  for (const fixture of sectionsFixture) {
    if (fixture.code === 'shipping') {
      await db._run(
        'update',
        sectionsCollection,
        {
          query: { _id: fixture._id },
          update: { $set: { excluded_channels: fixture.excluded_channels } },
        },
      );
    }
  }

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
