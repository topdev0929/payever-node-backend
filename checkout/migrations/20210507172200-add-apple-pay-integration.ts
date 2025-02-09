'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddApplePayIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'apple_pay');

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
    return 'Adds Apple Pay integration if not exists';
  }

  public migrationName(): string {
    return 'AddApplePayIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
