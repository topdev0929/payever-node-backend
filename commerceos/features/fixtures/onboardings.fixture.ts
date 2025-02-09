import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BaseFixture } from '@pe/cucumber-sdk';
import { OnboardingModel } from '../../src/onboarding/models';
import { OnboardingSchemaName } from '../../src/onboarding/schemas';
import { onboardings } from '../../fixtures/onboardings.fixture';

export = class OnboardingsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<OnboardingModel> =
      this.application.get(getModelToken(OnboardingSchemaName));
    for (const item of onboardings) {
      const onboarding: OnboardingModel = item as OnboardingModel;

      if (onboarding.afterLogin) {
        onboarding.afterLogin.forEach((x: any) => x._id = uuid());
      }
      if (onboarding.afterRegistration) {
        onboarding.afterRegistration.forEach((x: any) => x._id = uuid());
      }
      await model.create(onboarding);
    }
  }
};
