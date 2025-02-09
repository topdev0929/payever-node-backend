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
  const shippingAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'shipping' });
  let shippingApp: DashboardAppModel;
  if (shippingAppArr.length) {
    shippingApp = shippingAppArr[0];
  } else {
    shippingApp = await db._run('insert', dashboardAppsCollection, {
      code: 'shipping',
      tag: '<shipping-app></shipping-app>',
      dashboardInfo: {
        title: 'dashboard.apps.shipping',
        icon: 'icon-commerceos-shipping-32.png',
      },
      order: 6,
      allowedAcls: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
    });
  }

  let shippingExists: boolean = false;
  defaultBusinessAppsEntry.installedApps.forEach((installedApp: InstalledApp, index: number) => {
    if (installedApp.code === 'shipping') {
      defaultBusinessAppsEntry.installedApps[index].app = shippingApp._id;

      shippingExists = true;
    }
  });

  if (!shippingExists) {
    defaultBusinessAppsEntry.installedApps.push({
      installed: true,
      started: false,
      app: shippingApp._id,
      code: 'shipping',
    });
  }

  await db._run('update', defaultAppsCollection, {
    query: { _id: defaultBusinessAppsEntry._id },
    update: { $set: defaultBusinessAppsEntry },
  });

  // Invoice
  const invoiceAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'invoice' });
  let invoiceApp: DashboardAppModel;
  if (invoiceAppArr.length) {
    invoiceApp = invoiceAppArr[0];
  } else {
    invoiceApp = await db._run('insert', dashboardAppsCollection, {
      code: 'invoice',
      tag: '',
      dashboardInfo: {
        title: 'dashboard.apps.invoice',
        icon: 'icon-commerceos-invoice-32.png',
      },
      allowedAcls: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
    });
  }

  let invoiceExists: boolean = false;
  defaultBusinessAppsEntry.installedApps.forEach((installedApp: InstalledApp, index: number) => {
    if (installedApp.code === 'invoice') {
      defaultBusinessAppsEntry.installedApps[index].app = invoiceApp._id;

      invoiceExists = true;
    }
  });

  if (!invoiceExists) {
    defaultBusinessAppsEntry.installedApps.push({
      installed: true,
      started: false,
      app: invoiceApp._id,
      code: 'invoice',
    });
  }

  await db._run('update', defaultAppsCollection, {
    query: { _id: defaultBusinessAppsEntry._id },
    update: { $set: defaultBusinessAppsEntry },
  });

  // Adding both to business installedApps
  await db._run(
    'updateMany',
    businessCollection,
    {
      query: {
        installedApps: {
          $not: {
            $elemMatch: {
              code: 'shipping',
            },
          }
        },
      },
      update: {
        $push: {
          installedApps: {
            installed: false,
            started: false,
            setupStatus: 'notStarted',
            app: shippingApp._id,
            code: 'shipping',
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
            code: 'shipping',
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

  await db._run(
    'updateMany',
    businessCollection,
    {
      query: {
        installedApps: {
          $not: {
            $elemMatch: {
              code: 'invoice',
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
            app: invoiceApp._id,
            code: 'invoice',
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
            code: 'invoice',
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
