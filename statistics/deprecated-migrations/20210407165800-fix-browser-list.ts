import { browserFixture } from '../fixtures/browser.fixture';

const browserCollection: string = 'browsers';

async function up(db: any): Promise<any> {
  try {
    await db.dropCollection(browserCollection);
  } catch { }

  for (const fixture of browserFixture) {
    const existing: Array<{ }> = await db._find(browserCollection, { title: fixture.title });

    if (!existing.length) {
      await db.insert(browserCollection, fixture);
    }
  }

  return null;
}

function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
