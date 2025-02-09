'use strict';

import { BaseMigration } from '@pe/migration-kit';

const integrationsCollection: string = 'integrations';

export class HidePayExIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {
    await this.connection.collection(integrationsCollection).updateMany(
      { },
      {
        $set: { isVisible: true },
      },
    );

    await this.connection.collection(integrationsCollection).updateOne(
      { name: 'payex_faktura' },
      {
        $set: { isVisible: false },
      },
    );

    await this.connection.collection(integrationsCollection).updateOne(
      { name: 'payex_creditcard' },
      {
        $set: { isVisible: false },
      },
    );

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Hides PayEx integration';
  }

  public migrationName(): string {
    return 'HidePayExIntegrationMigration';
  }

  public version(): number {
    return 1;
  }
}
