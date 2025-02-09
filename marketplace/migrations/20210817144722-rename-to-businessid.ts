import { BaseMigration } from '@pe/migration-kit';

export class RenameToBusinessIdMigration extends BaseMigration {
  public async up(): Promise<void> {
    try {
      await this.connection.collection('products').dropIndex('business_1');
    } catch (e) { }

    await this.connection.collection('products').update(
      {
        businessUuid: {
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
      await this.connection.collection('product-subscriptions').dropIndex('marketplaceProduct_1_business_1');
    } catch (e) { }

    await this.connection.collection('product-subscriptions').update(
      {
        businessUuid: {
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
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Rename all business* to businessId';
  }
  public migrationName(): string {
    return '20210817144722-rename-to-businessid';
  }
  public version(): number {
    return 1;
  }
}
