import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { AbstractStateFixture } from '@pe/pact-kit';

import { integrationsFixture } from '../../../fixtures/integrations.fixture';
import { BusinessSchemaName, TerminalSchemaName, IntegrationSchemaName } from '../../../src/mongoose-schema/mongoose-schema.names';
import { TerminalModel } from '../../../src/terminal';
import { BusinessModel } from '../../../src/business';
import { IntegrationInterface } from '../../../src/integration/interfaces';
import { IntegrationModel } from '../../../src/integration/models';

export class OnboardedBusinessStateFixture extends AbstractStateFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly terminalModel: Model<TerminalModel> = this.application.get(getModelToken(TerminalSchemaName));
  private readonly integrationModel: Model<IntegrationModel> =
    this.application.get(getModelToken(IntegrationSchemaName));
  public getStateName(): string {
    return 'Onboarded business e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf created';
  }
  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      defaultLanguage: 'FR',
      name: 'Onboarded business #1',
      terminals: ['a98484b6-f01d-4d24-a5d3-8c0cf1b86999'],
    });
    await this.terminalModel.create({
      _id: 'a98484b6-f01d-4d24-a5d3-8c0cf1b86999',
      active: true,
      businessId: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      channelSet: 'aaaaaaaa-bbbb-4267-bda6-37dc33270a1b',
      default: true,
      name: 'Default terminal #1',
    });
    await this.integrationModel.create(integrationsFixture);
  }
}
