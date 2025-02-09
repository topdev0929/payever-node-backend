import { fixture } from '@pe/cucumber-sdk';

import { categoryFactory } from '../../factories/category.factory';
import { CategoryModel } from '../../../../src/categories/models';

const categoryId1: string = '2ca4aa66-1fd0-4d65-9103-8c7c635d8426';
const categoryId2: string = '651d8c62-d9df-4c1f-8a36-307173d77d46';
const businessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<CategoryModel>('CategoryModel', categoryFactory, [
  {
    _id: categoryId1,
    businessId: businessId,
    name: `Category 1`,
    slug: `category_1`,
  },
  {
    _id: categoryId2,
    businessId: businessId,
    name: `Category to find by name`,
    slug: `category_to_find_by_name`,
  },
  {
    name: `Other business category`,
    slug: `other_business_category`,
  },
]);
