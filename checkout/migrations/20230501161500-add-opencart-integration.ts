'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddOpenCartIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'opencart');

    const existing: Array<{ }> =
      await this.connection.collection(integrationsCollection).find({ _id: fixture._id }).toArray();
    if (!existing.length) {
      await this.connection.collection(integrationsCollection).insertOne(fixture);
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Adds OpenCart integration if not exists';
  }

  public migrationName(): string {
    return 'AddOpenCartIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
