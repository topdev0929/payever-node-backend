import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { integrationsFixture } from '../../fixtures/integrations.fixture';

import { IntegrationDocument } from '../../src/projections/models';


class IntegrationsFixture extends BaseFixture {
  protected readonly integrationModel: Model<IntegrationDocument> = this.application.get(`IntegrationModel`);
  public async apply(): Promise<void> {
    await this.integrationModel.create(
      ...integrationsFixture,
    );
  }  
}

export = IntegrationsFixture;
