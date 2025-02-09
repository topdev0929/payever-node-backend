import { cubesFixture } from '../fixtures/cubes.fixture';

async function up(db) {
  try {
    await db.removeIndex('channelsets', 'business_1');
  } catch (e) { }

  await db._run('update', 'channelsets', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });

  try {
    await db.removeIndex('dashboards', 'business_1');
  } catch (e) { }

  await db._run('update', 'dashboards', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
