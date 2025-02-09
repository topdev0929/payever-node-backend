'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class UpdateSantanderNLIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'santander_installment_nl');

    await this.connection.collection(integrationsCollection).updateOne(
      {
        _id: fixture._id,
      },
      {
        $set: fixture,
      },
    );

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Updates Santander NL integration if not exists';
  }

  public migrationName(): string {
    return 'UpdateSantanderNLIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
