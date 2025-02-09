// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';

export class RenameToBusinessIdForProductsMigration extends BaseMigration {
  public async up(): Promise<void> {
    // Products
    try {
      await this.connection.collection('products').dropIndex('businessUuid_1');
      await this.connection.collection('products').dropIndex('_id_1_businessUuid_1');
      await this.connection.collection('products').dropIndex('businessUuid_1_example_1');
      await this.connection.collection('products').dropIndex('businessUuid_1_sku_1');
    } catch (e) { }

    await this.connection.collection('products').update(
      {
        businessUuid: {
          $exists: true,
        },
      },
      {
        $rename: {
          businessUuid: 'businessId',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Rename all business* to businessId in products';
  }
  public migrationName(): string {
    return '20210817144722-rename-to-businessid-for-products';
  }
  public version(): number {
    return 1;
  }
}
