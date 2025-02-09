// tslint:disable:object-literal-sort-keys
import { BaseMigration } from "@pe/migration-kit";

export class RenameToBusinessIdMigration extends BaseMigration {
  public async up(): Promise<void> {
    // User Media
    try {
      await this.connection.collection('usermedias').dropIndex('business_1');
      await this.connection.collection('usermedias').dropIndex('business_1_example_1');
      await this.connection.collection('usermedias').dropIndex('album_1_business_1');
      await this.connection.collection('usermedias').dropIndex('name_1_url_1_business_1');
    } catch (e) {}

    await this.connection.collection('usermedias').update(
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

    // User attributes
    try {
      await this.connection.collection('userattributes').dropIndex('_id_1_business_1');
      await this.connection.collection('userattributes').dropIndex('business_1_name_1_type_1');
    } catch (e) {}

    await this.connection.collection('userattributes').update(
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

    // User attribute groups
    try {
      await this.connection.collection('userattributegroups').dropIndex('business_1');
      await this.connection.collection('userattributegroups').dropIndex('_id_1_business_1');
      await this.connection.collection('userattributegroups').dropIndex('business_1_name_1');
    } catch (e) {}

    await this.connection.collection('userattributegroups').update(
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

    // Counters
    await this.connection.collection('counters').update(
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
    return '20210820074121-rename-to-businessid';
  }
  public version(): number {
    return 1;
  }
}
