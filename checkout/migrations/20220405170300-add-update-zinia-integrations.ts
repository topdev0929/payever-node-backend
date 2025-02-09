'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class UpdateZiniaIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {

    await this.connection.collection(integrationsCollection).findOneAndUpdate(
      { name: 'openbank' },
      { $set: { name: 'zinia_bnpl'} },
    );

    await this.connection.collection(integrationsCollection).findOneAndUpdate(
      { name: 'openbank_pos' },
      { $set: { name: 'zinia_pos'} },
    );

    let fixture: any = integrationsFixture.find((integration: any) => integration.name === 'zinia_installment');
    await this.connection.collection(integrationsCollection).findOneAndUpdate(
      { name: fixture.name },
      { $set: fixture },
      { upsert: true },
    );
    fixture = integrationsFixture.find((integration: any) => integration.name === 'zinia_slice_three');
    await this.connection.collection(integrationsCollection).findOneAndUpdate(
      { name: fixture.name },
      { $set: fixture },
      { upsert: true },
    );

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update Zinia integrations';
  }

  public migrationName(): string {
    return 'UpdateZiniaIntegrationsMigration';
  }

  public version(): number {
    return 1;
  }
}
