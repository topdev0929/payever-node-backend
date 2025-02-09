'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddMessagingIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    let fixture: any =
      integrationsFixture.find((integration: any) => integration.name === 'facebook_messenger');

    let existing: Array<{ }> =
      await this.connection.collection(integrationsCollection).find({ _id: fixture._id }).toArray();
    if (!existing.length) {
      await this.connection.collection(integrationsCollection).insertOne(fixture);
    }

    fixture =
      integrationsFixture.find((integration: any) => integration.name === 'whatsapp');

    existing =
      await this.connection.collection(integrationsCollection).find({ _id: fixture._id }).toArray();
    if (!existing.length) {
      await this.connection.collection(integrationsCollection).insertOne(fixture);
    }

    fixture =
      integrationsFixture.find((integration: any) => integration.name === 'instagram');

    existing =
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
    return 'Adds messaging integrations if not exists';
  }

  public migrationName(): string {
    return 'AddMessagingIntegrationsMigration';
  }

  public version(): number {
    return 1;
  }
}
