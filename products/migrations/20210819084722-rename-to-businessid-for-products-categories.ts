// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';

export class RenameToBusinessIdForProductCategoriesMigration extends BaseMigration {
  public async up(): Promise<void> {
    // Product's categories
    await this.connection.collection('products').updateMany(
      {
        categories: {
          $exists: true,
          $ne: [],
          $type: 'array',
        },
      },
      [{
        $set: {
          categories: {
            $map: {
              input: '$categories',
              as: 'category',
              in: {
                _id: '$$category._id',
                businessId: '$$category.businessUuid',
                title: '$$category.title',
                slug: '$$category.slug',
              },
            },
          },
        },
      }],
      // {
      //   multi: true,
      //   upsert: false,
      // },
    );
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Rename all business* to businessId in products categories';
  }
  public migrationName(): string {
    return '20210819084722-rename-to-businessid-for-products-categories';
  }
  public version(): number {
    return 1;
  }
}
