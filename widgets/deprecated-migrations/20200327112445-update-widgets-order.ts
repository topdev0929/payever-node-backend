import { widgetsFixture } from '../fixtures/widgets.fixture';

const widgetsCollection: string = 'widgets';

async function up(db: any): Promise<any> {

  for (const fixture of widgetsFixture) {
    await db._run('update', widgetsCollection, {
      query: {
        type: fixture.type,
      },
      update: {
        $set: {
          order: fixture.order,
        },
      },
    });
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
