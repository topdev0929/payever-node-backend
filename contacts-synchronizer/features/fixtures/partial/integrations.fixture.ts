import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { IntegrationSchemaName, IntegrationModel } from '@pe/synchronizer-kit';

import { Integrations } from '../../../fixtures/integrations';

class IntegrationsFixture extends BaseFixture {
  private readonly integrationModel: Model<IntegrationModel> = this.application.get(
    getModelToken(IntegrationSchemaName),
  );
  public async apply(): Promise<void> {
    await this.integrationModel.create(Integrations);
  }
}

export = IntegrationsFixture;
