import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ProductCategoryModel } from '../../src/products/models';

class ProductCategoriesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ProductCategoryModel> = this.application.get('ProductCategoryModel');

    const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

    await model.create({
      businessId: someBusinessId,
      name: 'Category 1',
      slug: 'cat1',
    });

    await model.create({
      businessId: someBusinessId,
      name: 'Category 2',
      slug: 'cat2',
    });

    await model.create({
      businessId: someBusinessId,
      name: 'Category 3',
      slug: 'cat3',
    });
  }
}

export = ProductCategoriesFixture;
