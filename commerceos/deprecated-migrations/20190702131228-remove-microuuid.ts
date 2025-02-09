import { connect, connection } from 'mongoose';
import { Collection } from 'mongodb';

export async function up(db: any): Promise<any> {
  const url: string = db.connectionString;

  await connect(
    url,
    { useNewUrlParser: true },
  );

  try {
    await migrateApps();
  } finally {
    await connection.close();
  }
}

async function migrateApps(): Promise<void> {
  const allApps: any[] = await connection.db
    .collection('dashboardapps')
    .find({})
    .toArray();

  if (allApps.find((x: any) => !x.microUuid)) {
    throw Error('Expected every app to have microUuid.');
  }

  if (allApps.find((x: any) => !x.code)) {
    throw Error('Expected every app to have code.');
  }

  const appsByType: { business: any[]; user: any[] } = ['business', 'admin', 'user', 'partner'].reduce(
    (p: { business: any[]; user: any[] }, c: string) => {
      p[c] = allApps.filter((app: any) => app.access[c] && app.access[c].url);

      return p;
    },
    {} as { business: any[]; user: any[] },
  );

  await migrateInstalledApps(connection.db.collection('businesses'), appsByType.business);

  await migrateInstalledApps(connection.db.collection('users'), appsByType.user);

  const apps: any[] = allApps.map((x: any) => {
    x._id = x.microUuid;
    delete x.microUuid;

    return x;
  });

  const appsCollection: Collection = connection.db.collection('dashboardapps');
  await appsCollection.drop();
  await appsCollection.insertMany(apps);
}

async function migrateInstalledApps(collection: Collection, apps: any[]): Promise<void> {
  const items: any[] = await collection.find({}).toArray();

  for (const item of items) {
    item.installedApps = apps.map((app: any) => {
      const ia: any = item.installedApps && item.installedApps.find((x: any) => x.microUuid === app.microUuid);

      const r: any = { app: app.microUuid, code: app.code };
      if (ia && ia.installed !== null && ia.installed !== undefined) {
        r.installed = ia.installed;
      }
      if (ia && ia.started !== null && ia.started !== undefined) {
        r.started = ia.started;
      }
      if (ia && ia.startAt !== null && ia.startAt !== undefined) {
        r.startAt = ia.startAt;
      }

      return r;
    });

    await collection.replaceOne({ _id: item._id }, item);
  }
}
