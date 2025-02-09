import { fixture } from '@pe/cucumber-sdk';
import { ProductDocument } from '../../../../src/new-products/documents/product.document';
import { productFactory } from '../../factories/product.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<ProductDocument>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
  },
  {
    businessId: someOtherBusinessId,
    uuid: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
  },
  {
    businessId: someBusinessId,
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    videos: ['video3', 'video4'],
  },
  {
    businessId: someBusinessId,
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
]);
