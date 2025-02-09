import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { productFactory } from '../../factories';
import { ProductModel } from '../../../../src/products/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID_1: string = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID_2: string = '22222222-2222-2222-2222-222222222222';

class CreateAutomaticCollectionFixture extends BaseFixture {
  private readonly productModel: Model<ProductModel> = this.application.get(getModelToken('Product'));

  public async apply(): Promise<void> {
    await this.productModel.create(productFactory({
      _id: PRODUCT_ID_1,
      businessId: BUSINESS_ID,
    }));

    await this.productModel.create(productFactory({
      _id: PRODUCT_ID_2,
      businessId: BUSINESS_ID,
    }));
  }
}

export = CreateAutomaticCollectionFixture;
