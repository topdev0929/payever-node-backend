'use strict';
import { onboardings } from '../fixtures/onboardings.fixture';
import { BaseMigration } from '@pe/migration-kit';
import { v4 as uuid } from 'uuid';
import { OnboardingDto } from '../src/onboarding/dto';

export class UpdateOnboardingTrialMigration extends BaseMigration {

  public async up(): Promise<void> {


    const onboardingCollection: string = 'onboardings';
    const onboarding: OnboardingDto | undefined = onboardings.filter((onboarding) => onboarding.name === 'trial')?.shift();
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

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'add trial onboarding link';
  };

  public migrationName(): string {
    return UpdateOnboardingTrialMigration.name;;
  };

  public version(): number {
    return 1;
  };
}

