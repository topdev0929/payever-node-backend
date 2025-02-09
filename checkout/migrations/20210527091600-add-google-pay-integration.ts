'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddGooglePayIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'google_pay');

    await this.connection.collection(integrationsCollection).deleteOne({ name: 'google_wallet' });

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
    return 'Adds Google Pay integration if not exists';
  }

  public migrationName(): string {
    return 'AddGooglePayIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
