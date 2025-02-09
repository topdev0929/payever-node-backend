import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../src/products/models';
import { Model } from 'mongoose';

class ProductsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ProductModel> = this.application.get('NewProductModel');

    const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
    const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

    await model.create({
      _id: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
      active: true,
      barcode: 'barcode',
      businessId: someBusinessId,
      categories: [
        {
          _id: '3bd00872-e929-4eba-b9fb-d659731ed3cd',
          businessId: someBusinessId,
          slug: 'some',
          title: 'Some category',
        },
      ],
      currency: 'USD',
      description: 'Some product description',
      example: false,
      images: [],
      imagesUrl: [],
      price: 1000,
      sale: {
        onSales: false,
        salePrice: 2000,
      },
      sku: 'sku1',
      slug: 'slug-1',
      title: 'Some product',
      type: 'physical',
    });

    await model.create({
      _id: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
      active: true,
      barcode: 'barcode',
      businessId: someOtherBusinessId,
      categories: [
        {
          _id: '54c3f7b8-1d85-4682-aa6a-a485a468df9b',
          businessId: someOtherBusinessId,
          slug: 'other',
          title: 'Some other category',
        },
      ],
      currency: 'EUR',
      description: 'Some product description',
      example: false,
      images: [],
      imagesUrl: [],
      price: 5000,
      sale: {
        onSales: false,
        salePrice: 2000,
      },
      sku: 'sku2',
      slug: 'slug-2',
      title: 'Some product',
      type: 'physical',
    });

    await model.create({
      _id: 'e563339f-0b4c-4aef-92e7-203b9761981c',
      active: true,
      barcode: 'barcode',
      businessId: someBusinessId,
      categories: [
        {
          _id: '3bd00872-e929-4eba-b9fb-d659731ed3cd',
          businessId: someBusinessId,
          slug: 'some',
          title: 'Some category',
        },
      ],
      currency: 'USD',
      description: 'Some product description',
      example: false,
      images: [],
      imagesUrl: [],
      price: 1000,
      sale: {
        onSales: false,
        salePrice: 2000,
      },
      sku: 'sku2',
      slug: 'slug-3',
      title: 'Some product',
      type: 'physical',
    });

    await model.create({
      _id: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
      active: true,
      barcode: 'barcode',
      businessId: someBusinessId,
      categories: [
        {
          _id: '54c3f7b8-1d85-4682-aa6a-a485a468df9b',
          businessId: someBusinessId,
          slug: 'other',
          title: 'Some other category',
        },
      ],
      currency: 'EUR',
      description: 'Some product description',
      example: false,
      images: [],
      imagesUrl: [],
      price: 5000,
      sale: {
        onSales: false,
        salePrice: 2000,
      },
      sku: 'sku3',
      slug: 'slug-4',
      title: 'Some product',
      type: 'physical',
    });
  }
}

export = ProductsFixture;
