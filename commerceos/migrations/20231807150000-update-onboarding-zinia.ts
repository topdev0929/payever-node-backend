'use strict';
import { onboardings } from '../fixtures/onboardings.fixture';
import { BaseMigration } from '@pe/migration-kit';
import { v4 as uuid } from 'uuid';

export class SantanderDePosInstallmentMigration extends BaseMigration {

  public async up(): Promise<void> {


    const onboardingCollection: string = 'onboardings';


    for (const onboarding of onboardings) {
      if (onboarding) {
        if (onboarding.afterLogin) {
          onboarding.afterLogin.forEach((x: any) => x._id = uuid());
        }
        if (onboarding.afterRegistration) {
          onboarding.afterRegistration.forEach((x: any) => x._id = uuid());
        }

        await this.connection.collection(onboardingCollection).update(
          {
            _id: onboarding._id,
          },
          {
            ...onboarding,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            upsert: true,
          }
        );
      }
    }
  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'Update the afterRegistration steps of zinnia onboarding to update checkout styles and sections';
  };

  public migrationName(): string {
    return 'Update zinia checkout afterRegistration';
  };

  public version(): number {
    return 1;
  };
}

