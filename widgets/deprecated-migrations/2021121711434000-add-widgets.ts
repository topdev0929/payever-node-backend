import { widgetsFixture } from '../fixtures/widgets.fixture';

const widgetsCollection: string = 'widgets';

async function up(db: any): Promise<any> {
  for (const fixture of widgetsFixture) {
    const existing: Array<{ }> = await db._find(widgetsCollection, { type : fixture.type });

    if (!existing.length) {
      await db.insert(widgetsCollection, fixture);
    }
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
