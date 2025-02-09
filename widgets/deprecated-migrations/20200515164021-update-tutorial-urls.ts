import { widgetsFixture } from '../fixtures/widgets.fixture';
import * as shippingWidget from '../fixtures/shipping-widget.json';

const widgetsCollection: string = 'widgets';

async function up(db: any): Promise<void> {
  widgetsFixture.push(shippingWidget);

  for (const fixture of widgetsFixture) {
    await db._run('update', widgetsCollection, {
      query: {
        type: fixture.type,
      },
      update: {
        $set: {
          'tutorial.urls': fixture.tutorial.urls ? fixture.tutorial.urls : [],
        },
      },
    });
  }

  return null;
}

async function down(db: any): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;

