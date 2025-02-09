import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AbstractStateFixture } from '@pe/pact-kit';
import {
  BusinessModel,
  BusinessSchemaName,
} from '@pe/business-kit';
import { integrationsFixture } from '../../../fixtures/integrations.fixture';
import { CheckoutModel } from '../../../src/checkout';
import {
  CheckoutSchemaName,
  IntegrationSchemaName,
  BusinessIntegrationSubSchemaName,
} from '../../../src/mongoose-schema';
import { IntegrationModel, BusinessIntegrationSubModel, IntegrationInterface } from '../../../src/integration';

export class OnboardedBusinessStateFixture extends AbstractStateFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private readonly integrationModel: Model<IntegrationModel> =
    this.application.get(getModelToken(IntegrationSchemaName));
  private readonly subscriptionModel: Model<BusinessIntegrationSubModel> =
    this.application.get(getModelToken(BusinessIntegrationSubSchemaName));
  public getStateName(): string {
    return 'Onboarded business e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf created';
  }
  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      name: 'Onboarded business #1',
    });
    await this.checkoutModel.create({
      _id: 'bcbb44b5-bf36-4744-96a9-94c183c331cd',
      businessId: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      default: true,
    });
    await this.integrationModel.create(integrationsFixture);
    const qrIntegrations: IntegrationInterface = integrationsFixture
      .find((integrationPrototype: IntegrationInterface) => integrationPrototype.name === 'qr');
    await this.subscriptionModel.create({
      businessId: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      enabled: true,
      installed: true,
      integration: (qrIntegrations as any)._id,
    });
  }
}
