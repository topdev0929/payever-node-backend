import { DashboardAppModel } from '../src/models/dashboard-app.model';
import { DefaultAppsModel } from '../src/models/default-apps.model';
import { InstalledApp } from '../src/models/interfaces/installed-app';

const dashboardAppsCollection: string = 'dashboardapps';
const defaultAppsCollection: string = 'defaultapps';
const businessCollection: string = 'businesses';

export async function up(db: any): Promise<void> {
  const defaultBusinessAppsArr: DefaultAppsModel[] = await db._find(defaultAppsCollection, { _id: 'business' });
  const defaultBusinessAppsEntry: DefaultAppsModel = defaultBusinessAppsArr[0];

  if (!defaultBusinessAppsArr.length) {
    return;
  }

  const statisticsAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'statistics' });
  let statisticsApp: DashboardAppModel;
  if (statisticsAppArr.length) {
    statisticsApp = statisticsAppArr[0];
  } else {
    statisticsApp = await db._run('insert', dashboardAppsCollection, {
      code: 'statistics',
      tag: '',
      dashboardInfo: {
        title: 'dashboard.apps.statistics',
        icon: 'icon-commerceos-statistics-32.png',
      },
      order: 13,
      allowedAcls: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
    });
  }

  let statisticsExists: boolean = false;
  defaultBusinessAppsEntry.installedApps.forEach((installedApp: InstalledApp, index: number) => {
    if (installedApp.code === 'statistics') {
      defaultBusinessAppsEntry.installedApps[index].app = statisticsApp._id;
      defaultBusinessAppsEntry.installedApps[index].installed = true;

      statisticsExists = true;
    }
  });

  if (!statisticsExists) {
    defaultBusinessAppsEntry.installedApps.push({
      installed: true,
      started: false,
      app: statisticsApp._id,
      code: 'statistics',
    });
  }

  await db._run('update', defaultAppsCollection, {
    query: { _id: defaultBusinessAppsEntry._id },
    update: { $set: defaultBusinessAppsEntry },
  });

  // Adding to business installedApps
  await db._run(
    'updateMany',
    businessCollection,
    {
      query: {
        installedApps: {
          $not: {
            $elemMatch: {
              code: 'statistics',
            },
          }
        },
      },
      update: {
        $push: {
          installedApps: {
            installed: true,
            started: false,
            setupStatus: 'notStarted',
            app: statisticsApp._id,
            code: 'statistics',
          },
        },
      },
    },
  );
  await db._run(
    'updateMany',
    businessCollection,
    {
      query: {
        installedApps: {
          $elemMatch: {
            code: 'statistics',
            installed: false,
          },
        },
      },
      update: {
        $set: {
          'installedApps.$.installed': true,
        },
      },
    },
  );

  return null;
}

export function down(): Promise<void> {
  return null;
}
