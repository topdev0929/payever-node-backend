'use strict';
import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto } from '../src/onboarding/dto';
import { BaseMigration } from '@pe/migration-kit';

const onboardingCollection: string = 'onboardings';
const santanderDePos: string = 'santander-de-pos-installment';

export class SantanderDePosInstallmentMigration extends BaseMigration {

  public async up(): Promise<void> {

    const onboarding: OnboardingDto | undefined =
      onboardings.find((item: OnboardingDto) => item.name === santanderDePos);

    if (onboarding) {
      await this.connection.collection(onboardingCollection).findOneAndUpdate(
        {
          _id: onboarding._id,
        },
        {
          $set: {
            ...onboarding,
          },
        },
        {
          upsert: true,
        },
      );
    }
    return;
  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'Update santander de pos installment migration';
  };

  public migrationName(): string {
    return 'santanderDePosInstallment';
  };

  public version(): number {
    return 1;
  };
}

