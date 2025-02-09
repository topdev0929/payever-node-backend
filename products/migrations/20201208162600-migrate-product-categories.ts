import { BaseMigration } from '@pe/migration-kit';
import { Collection, Cursor } from 'mongodb';
import { ProductCategoryModel } from '../src/products/models';
import { CategoryModel } from '../src/categories/models';
import { SlugHelper } from '../src/categories/helpers';
import * as uuid from 'uuid';

export class MigrateOldCategories extends BaseMigration {
  public async up(): Promise<void> {
    const productcategoriesCollection: Collection<ProductCategoryModel>
      = this.connection.collection('productcategories');
    const categoriesCollection: Collection<CategoryModel> = this.connection.collection('categories');
    /* tslint:disable:await-promise */
    const productCategories: Cursor = await productcategoriesCollection.find({ businessUuid: { $exists : true}});
    for (let productCategory: any = await productCategories.next(); productCategory !== null; productCategory
      = await productCategories.next()) {
      await this.findOrCreateByNameAndBusiness(
        categoriesCollection,
        productCategory.title,
        productCategory.businessUuid,
      );
    }
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Migrate Old Categories to New one';
  }
  public migrationName(): string {
    return 'MigrateOldCategories';
  }
  public version(): number {
    return 1;
  }

  private async findOrCreateByNameAndBusiness(
    categoriesCollection: Collection<CategoryModel>,
    name: string,
    businessId: string,
  ): Promise<any> {
    /* tslint:disable:await-promise */
    return categoriesCollection.findOneAndUpdate(
      {
        $or : [
          { name, businessId },
          { slug: SlugHelper.getSlug(name), businessId },
        ],
      },
      {
        $set: {
          _id: uuid.v4(),
          ancestors: [],
          attributes: [],
          businessId: businessId,
          createdAt: new Date(),
          name: name,
          slug: SlugHelper.getSlug(name),
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      },
      () => { },
    );
  }
}
