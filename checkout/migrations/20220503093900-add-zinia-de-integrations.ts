'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddZiniaDeIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return [
        'zinia_bnpl_de',
        'zinia_pos_de',
        'zinia_installment_de',
        'zinia_slice_three_de',
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
    return 'Add Zinia DE integrations';
  }

  public migrationName(): string {
    return 'AddZiniaDeIntegrationsMigration';
  }

  public version(): number {
    return 1;
  }
}
