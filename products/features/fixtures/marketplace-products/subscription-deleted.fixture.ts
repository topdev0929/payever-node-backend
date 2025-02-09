import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ProductModel } from '../../../src/products/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class SubscriptionDeletedFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ProductModel> = this.application.get(getModelToken('Product'));
    await model.create({
      _id: PRODUCT_ID,
      active: true,
      barcode: 'barcode',
      businessId: BUSINESS_ID,
      categories: [],
      currency: 'USD',
      description: 'Some product description',
      example: false,
      images: [],
      imagesUrl: [],
      onSales: false,
      price: 1000,
      salePrice: 2000,
      sku: 'sku1',
      title: 'Some product',
      type: 'physical',
    });
  }
}

export = SubscriptionDeletedFixture;
