import { categoryFactory } from '../../factories';
import { CategoryModel } from '../../../../src/categories/models';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

const businessId: string = 'a560407c-b98d-40eb-8565-77c0d7ae23ea';
const categoryId1: string = 'a34eb905-11b3-46d3-a3f5-7ea71d92cda5';
const categoryId2: string = '0898cc57-be92-43b5-8c06-e100a4dc2601';

class CreateProductWithCategoryFixture extends BaseFixture {
  private readonly categoryModel: Model<CategoryModel> = this.application.get('CategoryModel');

  public async apply(): Promise<void> {
    await this.categoryModel.create(categoryFactory({
      _id: categoryId1,
      businessId: businessId,
      name: `Category 1`,
      slug: `category_1`,
    }));

    await this.categoryModel.create(categoryFactory({
      _id: categoryId2,
      businessId: businessId,
      name: `Category 2`,
      slug: `category_2`,
    }));
  }
}

export = CreateProductWithCategoryFixture;
