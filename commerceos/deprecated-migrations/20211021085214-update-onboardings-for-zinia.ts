import { v4 as uuid } from 'uuid';

import { onboardings } from '../fixtures/onboardings.fixture';

const dashboardAppsCollection: string = 'dashboardapps';
const onboardingCollection: string = 'onboardings';

async function up(db: any): Promise<any> {
  for (const onboarding of onboardings) {
    if (onboarding && onboarding.afterRegistration) {
      const taskIndex: any = onboarding.afterRegistration.findIndex((tasks: any) => tasks.name === 'install-apps');
      if (taskIndex > -1) {
        const apps: any = [...onboarding.afterRegistration[taskIndex].payload.apps];
        for (const app of apps) {
          const dashboardapp: any = await db._find(dashboardAppsCollection, { code: app.code });
          if (dashboardapp && Array.isArray(dashboardapp) && dashboardapp.length > 0) {
            app.app = dashboardapp[0]._id;
          }
        }

        onboarding.afterRegistration[taskIndex].payload.apps = apps;
        await db._run(
          'update',
          onboardingCollection,
          {
            query: {
              _id: onboarding._id,
            },

            update: {
              ...onboarding,
              createdAt: new Date(),
              updatedAt: new Date(),
            },

            options: {
              upsert: true,
            },
          },
        );
      }
    }
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
