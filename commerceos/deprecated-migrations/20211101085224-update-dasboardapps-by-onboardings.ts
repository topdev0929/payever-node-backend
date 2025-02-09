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
          await db._run(
            'update',
            dashboardAppsCollection,
            {
              query: {
                code: app.code,
              },
  
              update: {
                $addToSet: { businessTypes: onboarding.name },
              },
            },
          );
        }
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
