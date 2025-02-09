import { Document } from 'mongoose';

import { DashboardApp } from '../src/models/interfaces/dashboard-app';
import { DashboardInfo } from '../src/models/interfaces/dashboard-app/dashboard-info';

export async function up(db): Promise<void> {
  // 1. set `installed = true` in business defaultapps
  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: 'business',
        'installedApps.code': 'coupons',
      },
      update: {
        $set: {
          'installedApps.$.installed': true,
        },
      },
    },
  );

  // 2. update dashboardapp
  const couponDashboardApp: Pick<DashboardApp, 'dashboardInfo' | 'order'> = {
    dashboardInfo: {
      icon: "icon-commerceos-coupons-32.png",
      title: "dashboard.apps.coupons",
    } as DashboardInfo as DashboardInfo & Document,
    order: 8,
  }

  await db._run(
    'update',
    'dashboardapps',
    {
      query: {
        code: 'coupons',
      },
      update: {
        $set: couponDashboardApp,
      },
    },
  );
}

export async function down(db) {
  // 1. set `installed = false` in business defaultapps
  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: 'business',
        'installedApps.code': 'coupons',
      },
      update: {
        $set: {
          'installedApps.$.installed': false,
        },
      },
    },
  );

  // 2. remove coupons app props
  await db._run(
    'update',
    'dashboardapps',
    {
      query: {
        code: 'coupons',
      },
      update: {
        $unset: {
          dashboardInfo: "",
          order: "",
        },
      },
    },
  );
}
