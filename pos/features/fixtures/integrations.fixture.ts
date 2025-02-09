import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationsFixture } from '../../fixtures/integrations.fixture';

class IntegrationsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('integrations').insertMany(integrationsFixture);
  }
}

export = IntegrationsFixture;
