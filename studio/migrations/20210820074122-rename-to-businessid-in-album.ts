// tslint:disable:object-literal-sort-keys
import { BaseMigration } from "@pe/migration-kit";

export class RenameToBusinessId2Migration extends BaseMigration {
  public async up(): Promise<void> {
    try {
      await this.connection.collection('useralbums').dropIndex('_id_1_business_1');
      await this.connection.collection('useralbums').dropIndex('business_1_name_1');
      await this.connection.collection('useralbums').dropIndex('business_1_parent_1');
      await this.connection.collection('useralbums').dropIndex('ancestors_1_business_1');
      await this.connection.collection('useralbums').dropIndex('name_1_parent_1_business_1');
    } catch (e) {}

    await this.connection.collection('useralbums').update(
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
