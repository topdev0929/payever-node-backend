import { fixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories/product.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
  },
  {
    businessId: someBusinessId,
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
  },
  {
    businessId: someBusinessId,
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
]);
