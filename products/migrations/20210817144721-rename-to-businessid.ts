// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';

export class RenameToBusinessIdMigration extends BaseMigration {
  public async up(): Promise<void> {
    // Sample Products
    await this.connection.collection('sampleproducts').update(
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

    // Products
    await this.connection.collection('productsettings').update(
      {
        businessUuid: {
          $exists: true,
        },
      },
      {
        $rename: {
          businessUuid: 'businessIds',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );

    try {
      await this.connection.collection('productrecommendations').dropIndex('businessUuid_1_sku_1');
    } catch (e) { }

    await this.connection.collection('productrecommendations').update(
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

    try {
      await this.connection.collection('productcategories').dropIndex('businessUuid_1');
      await this.connection.collection('productcategories').dropIndex('slug_1_businessUuid_1');
      await this.connection.collection('productcategories').dropIndex('title_1_businessUuid_1');
    } catch (e) { }

    await this.connection.collection('productcategories').update(
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

    // Counter
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

    // Channel sets
    try {
      await this.connection.collection('channelsets').dropIndex('business_1');
      await this.connection.collection('channelsets').dropIndex('business_1_type_1');
    } catch (e) { }

    await this.connection.collection('channelsets').update(
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

    // Collections
    try {
      await this.connection.collection('collections').dropIndex('business_1');
      await this.connection.collection('collections').dropIndex('_id_1_business_1');
      await this.connection.collection('collections').dropIndex('name_1_business_1');
      await this.connection.collection('collections').dropIndex('slug_1_business_1');
    } catch (e) { }

    await this.connection.collection('collections').update(
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

    // Albums
    try {
      await this.connection.collection('albums').dropIndex('name_1_business_1');
    } catch (e) { }

    await this.connection.collection('albums').update(
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
    return '20210817144721-rename-to-businessid';
  }
  public version(): number {
    return 1;
  }
}
