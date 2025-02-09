import { fixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories/product.factory';
import { productCategoryFactory } from '../../factories/product-category.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

const cat1: any = productCategoryFactory({ _id: '82cfeeff-e483-4d61-acc5-b49103d8ec57' });
const cat2: any = productCategoryFactory({ _id: '09b0aae1-0a95-4e5c-8c10-8cd11d9b0cec' });

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    categories: [cat1],
    slug: 'slug-1',
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
  },
  {
    businessId: someBusinessId,
    categories: [cat2],
    slug: 'slug-2',
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
  },
  {
    businessId: someBusinessId,
    categories: [cat1, cat2],
    slug: 'slug-3',
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
]);
