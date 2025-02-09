import { DashboardAppModel } from '../src/models/dashboard-app.model';
import { InstalledApp } from '../src/models/interfaces/installed-app';
import { SetupStatusEnum } from '../src/apps/enums/setup-status.dto';

const allowedList: string[] = [
  'checkout',
  'connect',
  'shop',
  'products',
  'settings',
  'transactions',
  'message',
];
const key: string = 'business';

async function up(db: any): Promise<void> {
  const dashboardApps: DashboardAppModel[] = await db._find('dashboardapps', { });

  const installedApps: InstalledApp[] = [];

  for (const app of dashboardApps) {
    if (allowedList.indexOf(app.code) === -1) {
      continue;
    }

    const installed: boolean = app.access && app.access[key] && app.access[key].defaultInstalled;

    const ia: any = {
      app: app._id,
      code: app.code,
      started: false,
      order: app.order,
      installed: installed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Wierd exception I saw in data
    if (app.code === 'transactions') {
      ia.setupStatus = SetupStatusEnum.Completed;
      ia.stepStatus = SetupStatusEnum.Completed;
    }

    installedApps.push(ia);
  }

  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: key,
      },

      update: {
        installedApps,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      options: {
        upsert: true,
      },
    },
  );

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
