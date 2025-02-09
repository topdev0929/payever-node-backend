// tslint:disable:object-literal-sort-keys
import { BaseMigration } from "@pe/migration-kit";

export class RenameToBusinessIdMigration extends BaseMigration {
  public async up(): Promise<void> {
    try {
      await this.connection.collection('sites').dropIndex('business_1');
      await this.connection.collection('sites').dropIndex('business_1_isDefault_1');
      await this.connection.collection('sites').dropIndex('business_1_name_1');
    } catch (e) {}

    await this.connection.collection('sites').update(
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
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Rename all business* to businessId';
  }
  public migrationName(): string {
    return '20210820074122-rename-to-businessid';
  }
  public version(): number {
    return 1;
  }
}
