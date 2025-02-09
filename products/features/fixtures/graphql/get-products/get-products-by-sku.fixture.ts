import { fixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories/product.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    sku: '12345678',
    title: 'Salt',
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
  },
  {
    businessId: someBusinessId,
    price: 4,
    sku: '1234',
    title: 'Sugar',
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    variants: [
      {
        description: 'brown sugar',
        id: 'some_id_1',
        price: 7,
        sku: 'sgrb',
        title: 'brown sugar',
      },
      {
        description: 'white sugar',
        id: 'some_id_2',
        price: 3,
        sku: 'sgrw',
        title: 'white sugar',
      },
    ],
  },
  {
    businessId: someBusinessId,
    categories: [
      {
        _id: '_id',
        businessId: someBusinessId,
        slug: 'slug',
        title: 'supplement',
      },
    ],
    price: 5,
    sku: 'abcde',
    title: 'Pepper',
    uuid: '894d57ae-a164-4608-af05-7f5ab78bb0a1',
  },
  {
    businessId: someBusinessId,
    categories: [
      {
        _id: '_id',
        businessId: someBusinessId,
        slug: 'slug',
        title: 'supplement',
      },
    ],
    price: 5,
    sku: '12345abcde',
    title: 'phone',
    uuid: '275e854f-4d0d-402e-bf8d-cf09d8b0bfa8',
  },
  {
    businessId: someBusinessId,
    categories: [
      {
        _id: '_id',
        businessId: someBusinessId,
        slug: 'slug',
        title: 'supplement',
      },
    ],
    price: 5,
    sku: 'fgh',
    title: 'Battery',
    uuid: '810e8173-e8ba-406d-9a03-246e97b08f33',
  },
  {
    businessId: someOtherBusinessId,
    sku: '12345abcde',
    title: 'phone',
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
  {
    businessId: someOtherBusinessId,
    price: 5,
    sku: 'fghgh',
    title: 'Battery',
    uuid: '8fdbaeed-749a-4b72-bf1c-c7d0e2aecd87',
  },
]);
