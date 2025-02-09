import { fixture } from '@pe/cucumber-sdk';
import { ProductCategoryModel } from '../../../../src/products/models';
import { productCategoryFactory } from '../../factories/product-category.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

export = fixture<ProductCategoryModel>('CategoryModel', productCategoryFactory, [
  {
    businessId: someBusinessId,
    name: `Category 1`,
  },
  {
    businessId: someBusinessId,
    name: 'Category 2',
  },
  {
    businessId: someBusinessId,
    name: 'Category 3',
  },
]);
