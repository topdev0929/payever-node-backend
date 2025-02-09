import { DashboardAppModel } from '../src/models/dashboard-app.model';
import { DefaultAppsModel } from '../src/models/default-apps.model';
import { InstalledApp } from '../src/models/interfaces/installed-app';
import { connect, connection } from 'mongoose';

const dashboardAppsCollection: string = 'dashboardapps';
const defaultAppsCollection: string = 'defaultapps';

export async function up(db: any): Promise<void> {
  const studioAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'studio' });
  const defaultBusinessAppsArr: DefaultAppsModel[] = await db._find(defaultAppsCollection, { _id: 'business' });
  if (!studioAppArr.length || !defaultBusinessAppsArr.length) {
    return;
  }

  const studioApp: DashboardAppModel = studioAppArr[0];
  const defaultBusinessAppsEntry: DefaultAppsModel = defaultBusinessAppsArr[0];
  defaultBusinessAppsEntry.installedApps.forEach((installedApp: InstalledApp, index: number) => {
    if (installedApp.code === 'studio') {
      defaultBusinessAppsEntry.installedApps[index].app = studioApp._id;
    }
  });

  await db._run('update', defaultAppsCollection, {
    query: { _id: defaultBusinessAppsEntry._id },
    update: { $set: defaultBusinessAppsEntry },
  });

  return null;
}

export function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
