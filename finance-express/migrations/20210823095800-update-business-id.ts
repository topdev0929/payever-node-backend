'use strict';
import { BaseMigration } from '@pe/migration-kit';

export class UpdateBusinessIdMigration extends BaseMigration {

  public async up(): Promise<void> {
    try {
      await this.connection.collection('widgets').dropIndex('business_1');
      await this.connection.collection('widgets').dropIndex('business_1_checkoutId_1');
      await this.connection.collection('widgets').dropIndex('business_1_checkoutId_1_type_1');
      await this.connection.collection('widgets').dropIndex('business_1_payments.paymentMethod_1');
    } catch (e) {}

   await this.connection.collection('widgets').update(
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
        upsert: false,
        multi: true,
      },
    );
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
