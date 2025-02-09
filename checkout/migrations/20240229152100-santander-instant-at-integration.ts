'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddSantanderInstantAtIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return [
        'santander_instant_at',
      ].includes(integration.name);
    });


    for (const fixture of fixtures) {
      await this.connection.collection(integrationsCollection).findOneAndUpdate(
        { name: fixture.name },
        { $set: fixture },
        { upsert: true },
      );
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Add Santander Instant AT integrations';
  }

  public migrationName(): string {
    return 'AddSantanderInstantAtIntegrationsMigration';
  }

  public version(): number {
    return 2;
  }
}
