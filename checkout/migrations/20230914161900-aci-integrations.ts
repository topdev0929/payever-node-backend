'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddSantanderB2BIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return [
        'concardis',
        'payone',
        'nets',
      ].includes(integration.name);
    });
    
    await this.connection.collection(integrationsCollection).deleteMany({ name: 'aci'})
    
    for (const fixture of fixtures) {
      await this.connection.collection(integrationsCollection).findOneAndUpdate(
        {
          name: fixture.name,
          issuer: fixture.issuer,
        },
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
    return 'Add aci integration';
  }

  public migrationName(): string {
    return 'AddAciIntegrationMigration';
  }

  public version(): number {
    return 2;
  }
}
