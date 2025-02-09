import { fixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories/product.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    images: ['image1', 'image2'],
    updatedAt: '2020-11-14T20:22:33.702+00:00',
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    videos: ['video1', 'video2'],
  },
  {
    businessId: someOtherBusinessId,
    updatedAt: '2020-11-14T20:22:35.702+00:00',
    uuid: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
  },
  {
    businessId: someBusinessId,
    updatedAt: '2020-11-14T20:22:37.702+00:00',
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
  },
  {
    businessId: someBusinessId,
    updatedAt: '2020-11-14T20:22:39.702+00:00',
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
]);
