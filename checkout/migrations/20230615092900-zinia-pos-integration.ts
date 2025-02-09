'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class AddZiniaPosIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return [
        'zinia_pos_installment',
        'zinia_pos_slice_three',
        'zinia_pos_installment_de',
        'zinia_pos_slice_three_de',
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
    return 'Add Zinia pos integrations';
  }

  public migrationName(): string {
    return 'AddZiniaPosIntegrationsMigration';
  }

  public version(): number {
    return 1;
  }
}
