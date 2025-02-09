import { fixture } from '@pe/cucumber-sdk';

import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories';

const someBusinessId: string = 'a560407c-b98d-40eb-8565-77c0d7ae23ea';

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    slug: 'slug-update',
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
  },
]);
