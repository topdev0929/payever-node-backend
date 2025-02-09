import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { IntegrationModel } from '../../src/proxy/models';
import { IntegrationSchemaName } from '../../src/proxy/schemas';
import { integrationsFixture } from '../../fixtures/integrations.fixture';

class IntegrationFixture extends BaseFixture {
  private readonly integrationModel: Model<IntegrationModel> =
    this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    await this.integrationModel.create(integrationsFixture);
  }
}

export = IntegrationFixture;
