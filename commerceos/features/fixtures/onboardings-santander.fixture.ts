import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { OnboardingModel } from '../../src/onboarding/models';
import { OnboardingSchemaName } from '../../src/onboarding/schemas';
import { onboardings } from '../../fixtures/onboardings.fixture';
import { ActionDto, OnboardingDto } from '../../src/onboarding/dto';
import { RegisterStep } from '../../src/onboarding/enums';
import { environment } from '../../src/environments';
import { PaymentDefaultAppsSantanderFixture } from '../../fixtures/payments-default-apps-fixture';

export = class OnboardingsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<OnboardingModel> =
      this.application.get(getModelToken(OnboardingSchemaName));

    for (const item of onboardings) {
      const onboarding: OnboardingModel = item as OnboardingModel;

      const onboardingToCreate: OnboardingDto = {
        ...onboarding,
      };

      if (onboardingToCreate.name === 'santander') {

        let orderId: number = 0;

        const tokenStep: ActionDto = {
          method: 'PATCH',
          name: `refresh-token`,
          orderId: ++orderId,
          payload: { },
          priority: 1,
          registerSteps: [RegisterStep.business],
          url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
        };

        let installIntegrations: ActionDto[] = PaymentDefaultAppsSantanderFixture.map((action: any) => {
          return {
            method: 'PATCH',
            name: `install-${action.integration}`,
            orderId: ++orderId,
            payload: { },
            priority: 2,
            registerSteps: [RegisterStep.business],
            url: `${environment.microUrlConnect}/business/:businessId/integration/${action.integration}/install`,

            integration: {
              country: action.country,
              device: action.device,
              method: action.method,
              name: action.name,
            },
          };
        } );

        installIntegrations = [
          tokenStep,
          ...installIntegrations,
        ];

        onboardingToCreate.afterRegistration = [
          ...onboarding.afterRegistration,
        ];
        onboardingToCreate.afterRegistration.push(...installIntegrations);
      }

      await model.create(onboardingToCreate);
    }
  }
};
