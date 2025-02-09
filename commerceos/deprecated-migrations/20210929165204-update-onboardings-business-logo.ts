import { v4 as uuid } from 'uuid';

import { onboardings } from '../fixtures/onboardings.fixture';

const onboardingCollection: string = 'onboardings';

export async function up(db: any): Promise<any> {

  for (const onboarding of onboardings) {
    if (onboarding) {
      if (onboarding.afterLogin) {
        onboarding.afterLogin.forEach((x: any) => x._id = uuid());
      }
      if (onboarding.afterRegistration) {
        onboarding.afterRegistration.forEach((x: any) => x._id = uuid());
      }

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

  return null;
}

export function down(): Promise<any> {
  return null;
}
