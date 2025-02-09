import { widgetsHelpUrlFixture } from '../fixtures/widgets-help-url.fixture';

const widgetsCollection: string = 'widgets';

async function up(db: any): Promise<any> {
  for (const fixture of widgetsHelpUrlFixture) {
    const existing: Array<{ }> = await db._find(widgetsCollection, { type : fixture.type });

    if (existing.length) {
      await db._run(
        'update',
        widgetsCollection,
        {
          options: { },
          query: { type: fixture.type },
          update: { $set: {
            helpUrl: fixture.helpUrl,
          } },
        },
      );
    }
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
