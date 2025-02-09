import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { productFactory } from '../factories';
import { ProductModel } from '../../../src/products/models';

class LockProductWithoutVariantsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ProductModel> = this.application.get('NewProductModel');

    const productId: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    const sku: string = 'testProductSku';

    await model.create(productFactory({
      _id: productId,
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      sku,
    }));
  }
}

export = LockProductWithoutVariantsFixture;
