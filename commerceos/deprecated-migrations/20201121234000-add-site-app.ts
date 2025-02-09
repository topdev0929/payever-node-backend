import { v4 as uuid } from 'uuid';
import { SiteApp } from '../fixtures/add-site-app.fixture';

const defaultAppsCollection = 'defaultapps';
const businessesCollection: string = 'businesses';

async function up(db) {
  await db._run(
    'update',
    defaultAppsCollection,
    {
      query: {
        _id: 'business'
      },
      update: { $push: { installedApps: SiteApp } },
    },
  );

  await db._run(
    'updateMany',
    businessesCollection,
    {
      query: { },
      update: { $push: { installedApps: SiteApp } },
    }
  );

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
