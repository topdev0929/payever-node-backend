import { categoryFactory } from '../../factories';
import { CategoryModel } from '../../../../src/categories/models';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

const businessId: string = 'a560407c-b98d-40eb-8565-77c0d7ae23ea';
const categoryId: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const subcategoryId: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateProductsOldCategoriesHaveMappingsFixture extends BaseFixture {
  private readonly categoryModel: Model<CategoryModel> = this.application.get('CategoryModel');

  public async apply(): Promise<void> {
    await this.categoryModel.create(categoryFactory({
      _id: categoryId,
      businessId: businessId,
      name: `Clothing`,
    }));

    await this.categoryModel.create(categoryFactory({
      _id: subcategoryId,
      businessId: businessId,
      name: 'Shirts',
      parent: categoryId,
    }));
  }
}

export = CreateProductsOldCategoriesHaveMappingsFixture;
