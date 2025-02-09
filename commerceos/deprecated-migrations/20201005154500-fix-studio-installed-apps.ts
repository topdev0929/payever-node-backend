import {dashboardAppModel, DashboardAppModel} from '../src/models/dashboard-app.model';
import { InstalledApp } from '../src/models/interfaces/installed-app';
import { connect, connection, Model } from 'mongoose';
import {businessModel, BusinessModel} from '../src/models/business.model';

const dashboardAppsCollection: string = 'dashboardapps';
const businessCollection: string = 'businesses';

export async function up(db: any): Promise<void> {
  const url: string = db.connectionString;

  await connect(
      url,
      { useNewUrlParser: true, useFindAndModify: false },
  );

  try {
    await (dashboardAppModel as any).syncIndexes();
    await (businessModel as any).syncIndexes();

    await fixInstalledStudio(db, businessModel);
  } finally {
    await connection.close();
  }
}

async function fixInstalledStudio(db: any, syncedBusinessModel: Model<BusinessModel>): Promise<void> {
  const studioAppArr: DashboardAppModel[] = await db._find(dashboardAppsCollection, { code: 'studio' });
  if (!studioAppArr.length) {
    return;
  }

  const studioApp: DashboardAppModel = studioAppArr[0];
  const businessArr: BusinessModel[] = await db._find(businessCollection, { });

  const queriesArr: any[] = [];

  await businessArr.forEach(async (business: BusinessModel) => {
    let hasWrongId: boolean = false;
    await business.installedApps.forEach(async (installedApp: InstalledApp, index: number) => {
      if (installedApp.code === 'studio' && business.installedApps[index].app !== studioApp._id) {
        business.installedApps[index].app = studioApp._id;
        hasWrongId = true;
      }
    });

    if (hasWrongId) {
      queriesArr.push({
        updateOne: {
          'filter': { _id: business._id },
          'update': { $set: business },
        },
      });
    }
  });

  if (queriesArr.length) {
    await syncedBusinessModel.bulkWrite(queriesArr);
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
