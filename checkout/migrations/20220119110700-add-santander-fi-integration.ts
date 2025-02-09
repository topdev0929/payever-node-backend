'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddSantanderFIIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'santander_installment_fi');

    const existing: Array<{ }> =
      await this.connection.collection(integrationsCollection).find({ _id: fixture._id }).toArray();
    if (!existing.length) {
      await this.connection.collection(integrationsCollection).insertOne(fixture);
    }

    const posFixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'santander_pos_installment_fi');

    const posExisting: Array<{ }> =
      await this.connection.collection(integrationsCollection).find({ _id: posFixture._id }).toArray();
    if (!posExisting.length) {
      await this.connection.collection(integrationsCollection).insertOne(posFixture);
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Adds Santander FI integration if not exists';
  }

  public migrationName(): string {
    return 'AddSantanderFIIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
