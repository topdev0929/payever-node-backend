'use strict';
import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

export class AddFinanceExpress extends BaseMigration {

  public async up(): Promise<void> {
    for (const integration of integrationsFixture) {
      if (integration.code !== 'finance-express') {
        continue;
      }

      await this.connection
        .collection('integrations')
        .insertOne(integration);
    }
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Adds finance express integration';
  }

  public migrationName(): string {
    return 'AddFinanceExpress';
  }

  public version(): number {
    return 1;
  }

}
