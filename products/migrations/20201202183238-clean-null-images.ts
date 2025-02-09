import { BaseMigration } from '@pe/migration-kit';
import { Cursor, Collection } from 'mongodb';
import { ProductModel } from '../src/products/models';

export class CleanNullProductImagesMigration extends BaseMigration {
  public async up(): Promise<void> {
    const productsCollection: Collection<ProductModel> = this.connection.collection('products');

    await productsCollection.updateMany({
      images: null,
    },                                  {
      $pull: {
        images: null,
      },
    } as any);
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Clean invalid null values from "images" property of product';
  }
  public migrationName(): string {
    return 'CleanNullProductImages';
  }
  public version(): number {
    return 1;
  }
}
