import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductVariantModel } from '../../../../src/products/models/product-variant.model.js';
import * as variants from './variants.json';

export = class VariantsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const variantModel: Model<ProductVariantModel> = this.application.get(getModelToken('ProductVariant'));

    await variantModel.create(variants);
  }
};
