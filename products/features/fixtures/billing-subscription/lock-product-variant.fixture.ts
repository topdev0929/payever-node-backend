import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { productFactory, variantFactory } from '../factories';
import { ProductModel } from '../../../src/products/models';
import { ProductVariantModel } from '../../../src/products/models/product-variant.model';

class LockProductVariantFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const productModel: Model<ProductModel> = this.application.get('NewProductModel');
    const productVariantModel: Model<ProductVariantModel> = this.application.get('ProductVariantModel');

    const productId: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    const sku: string = 'testProductSku';

    await productModel.create(productFactory({
      _id: productId,
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      sku,
    }));

    await productVariantModel.create(variantFactory({
      _id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      product: productId,
    }));

    await productVariantModel.create(variantFactory({
      _id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      product: productId,
    }));
  }
}

export = LockProductVariantFixture;
