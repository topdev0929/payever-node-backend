import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { AbstractStateFixture } from '@pe/pact-kit';

import { BusinessModelLocal, BusinessSchemaName } from '../../../src/business';
import { integrationsFixture } from '../../../fixtures/integrations.fixture';
import { IntegrationModel, IntegrationInterface, IntegrationSchemaName } from '../../../src/integration';

export class OnboardedBusinessStateFixture extends AbstractStateFixture {
  private readonly businessModel: Model<BusinessModelLocal> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly integrationModel: Model<IntegrationModel> =
    this.application.get(getModelToken(IntegrationSchemaName));
  public getStateName(): string {
    return 'Onboarded business e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf created';
  }
  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      name: 'Onboarded business #1',

      companyAddress: { },
      companyDetails: { },
      contactDetails: { },
      subscriptions: [],
    });
    await this.integrationModel.create(integrationsFixture);
  }
}
