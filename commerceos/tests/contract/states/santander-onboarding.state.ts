import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { AbstractStateFixture } from '@pe/pact-kit';

import { OnboardingSchemaName } from '../../../src/onboarding/schemas';
import { OnboardingModel } from '../../../src/onboarding/models';
import { OnboardingDto } from '../../../src/onboarding/dto';

import { onboardings } from '../../../fixtures/onboardings.fixture';

export class SantanderOnboardingFixture extends AbstractStateFixture {
  private readonly onboardingModel: Model<OnboardingModel> = this.application.get(getModelToken(OnboardingSchemaName));
  public async apply(): Promise<void> {
    const santanderOnboardingPrototype: OnboardingDto =
      onboardings.find((onboarding: OnboardingDto) => onboarding.name === 'santander');

    await this.onboardingModel.create(santanderOnboardingPrototype);
  }

  public getStateName(): string {
    return 'db contains santander onboarding';
  }
}
