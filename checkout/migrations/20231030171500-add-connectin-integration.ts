'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddConnectinIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const integrations = ['connectin'];
    const fixtures: any =
      integrationsFixture.filter((integration: any) => integrations.includes(integration.name));
    for (const fixture of fixtures) {
      const existing: Array<{}> =
        await this.connection.collection(integrationsCollection).find({ _id: fixture._id }).toArray();
      if (!existing.length) {
        await this.connection.collection(integrationsCollection).insertOne(fixture);
      }
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Adds Connectin integration if not exists';
  }

  public migrationName(): string {
    return 'AddConnectinIntegrationsMigration';
  }

  public version(): number {
    return 1;
  }
}
