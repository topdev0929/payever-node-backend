import { connect, connection } from 'mongoose';
import { appTypes } from '../src/models/schemas/app-types';
import { DashboardApp } from '../src/models/interfaces/dashboard-app';
import { dashboardAppModel, DashboardAppModel } from '../src/models/dashboard-app.model';
import { defaultAppsModel, DefaultAppsModel } from '../src/models/default-apps.model';
import { InstalledApp } from '../src/models/interfaces/installed-app';
import { businessModel } from '../src/models/business.model';

export async function up(db: any): Promise<void> {
  const url: string = db.connectionString;

  await connect(
    url,
    { useNewUrlParser: true, useFindAndModify: false },
  );

  try {
    await (dashboardAppModel as any).syncIndexes();
    await (defaultAppsModel as any).syncIndexes();

    await addDefaults();
  } finally {
    await connection.close();
  }
}

async function addDefaults(): Promise<void> {
  const appsByType: { [key: string]: DashboardApp[] } = await getAppsByType({ code: 'studio'});

  for (const key of Object.keys(appsByType)) {
    const da: DefaultAppsModel = await defaultAppsModel.findOneAndUpdate(
      { _id: key },
      { _id: key },
      {
        new: true,
        upsert: true,
      },
    );

    for (const app of appsByType[key]) {
      const ia: InstalledApp = da.installedApps.create({ app });
      ia.code = app.code;
      ia.installed = app.access && app.access[key] && app.access[key].defaultInstalled;
      da.installedApps.push(ia);

      if (key === 'business') {
        const installedAppStudio: any = {
          'app': app._id,
          'code': app.code,
          'installed': false,
        };

        await businessModel.updateMany({ }, {
          $push: { installedApps : installedAppStudio } as never,
        });
      }
    }

    await da.save();
  }
}

async function getAppsByType(filter: any): Promise<{ [key: string]: DashboardApp[] }> {
  const apps: DashboardAppModel[] = await dashboardAppModel.find(filter);
  const types: { [key: string]: DashboardApp[] } = appTypes.reduce(
    (p: { [key: string]: DashboardApp[] }, c: string) => {
      p[c] = [];

      return p;
    },
    { } as { [key: string]: DashboardApp[] },
  );

  return apps.reduce((p: { [key: string]: DashboardApp[] }, c: DashboardAppModel) => {
    for (const key of Object.keys(p)) {
      if (c.access && c.access[key] && c.access[key].url) {
        p[key].push(c);
      }
    }

    return p;
  },                 types);
}
