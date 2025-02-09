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

  // Shipping
  const subscriptionsAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'subscriptions' });
  let subscriptionsApp: DashboardAppModel;
  if (subscriptionsAppArr.length) {
    subscriptionsApp = subscriptionsAppArr[0];
  } else {
    subscriptionsApp = await db._run('insert', dashboardAppsCollection, {
      code: 'subscriptions',
      tag: '',
      dashboardInfo: {
        title: 'dashboard.apps.subscriptions',
        icon: 'icon-commerceos-subscriptions-32.png',
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

  let subscriptionsExists: boolean = false;
  defaultBusinessAppsEntry.installedApps.forEach((installedApp: InstalledApp, index: number) => {
    if (installedApp.code === 'subscriptions') {
      defaultBusinessAppsEntry.installedApps[index].app = subscriptionsApp._id;
      defaultBusinessAppsEntry.installedApps[index].installed = true;

      subscriptionsExists = true;
    }
  });

  if (!subscriptionsExists) {
    defaultBusinessAppsEntry.installedApps.push({
      installed: true,
      started: false,
      app: subscriptionsApp._id,
      code: 'subscriptions',
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
              code: 'subscriptions',
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
            app: subscriptionsApp._id,
            code: 'subscriptions',
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
            code: 'subscriptions',
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
