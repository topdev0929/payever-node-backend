'use strict';

import { BaseMigration } from '@pe/migration-kit';

export class UpdateBusinessIdMigration extends BaseMigration {

  public async up(): Promise<void> {
    try {
      await this.connection.collection('businessintegrationsubscriptions').dropIndex('business_1');
      await this.connection.collection('businessintegrationsubscriptions').dropIndex('integration_1_business_1');
    } catch (e) { }

    await this.connection.collection('businessintegrationsubscriptions').update(
      {
        business: {
          $exists: true,
        },
      },
      {
        $rename: {
          business: 'businessId',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );

    try {
      await this.connection.collection('connections').dropIndex('business_1');
    } catch (e) { }

    await this.connection.collection('connections').update(
      {
        business: {
          $exists: true,
        },
      },
      {
        $rename: {
          business: 'businessId',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update business id';
  }

  public migrationName(): string {
    return 'UpdateBusinessIdMigration';
  }

  public version(): number {
    return 1;
  }
}
