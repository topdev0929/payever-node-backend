import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { productFactory } from '../factories/product.factory';
import { ProductModel } from '../../../src/products/models';

class UpdateProductFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ProductModel> = this.application.get('NewProductModel');

    const productId: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    const sku: string = 'testProductSku';

    await model.create(productFactory({
      _id: productId,
      businessId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      sku,
    }));
  }
}

export = UpdateProductFixture;
