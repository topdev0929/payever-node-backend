import { SiteDashboardApp } from '../fixtures/site-dashboard-app.fixture';

const appName = 'site';

export async function up(db) {
  // insert site for dashboard app
  const siteApps: any[] = await db._find('dashboardapps', {code: 'site'});

  if (siteApps.length === 0) {
    await db.insert('dashboardapps', SiteDashboardApp);
  }

  // Setting app is not installed by default
  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: 'business',
        'installedApps.code': appName,
      },
      update: {
        $set: {
          'installedApps.$.installed': false,
        },
      },
    },
  );
}

export const down = async (db) => {};
