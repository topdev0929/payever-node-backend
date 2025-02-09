'use strict';

import { BaseMigration } from '@pe/migration-kit';

const integrationsCollection: string = 'integrations';

export class RemoveAciPaymentMethods extends BaseMigration {

  public async up(): Promise<void> {

    // aci concardis
    await this.connection.collection(integrationsCollection).deleteOne(
      {
        name: 'concardis',
        issuer: 'aci',
      },
    );

    // aci payone
    await this.connection.collection(integrationsCollection).deleteOne(
      {
        name: 'payone',
        issuer: 'aci',
      },
    );

    return;
  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'Remove aci payment methods';
  };

  public migrationName(): string {
    return 'RemoveAciPaymentMethods';
  };

  public version(): number {
    return 1;
  };

}

