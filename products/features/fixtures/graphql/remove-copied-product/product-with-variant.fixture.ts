import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { businessFactory, productFactory, variantFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';
import { ProductModel } from '../../../../src/products/models';
import { ProductVariantModel } from '../../../../src/products/models/product-variant.model';

const BUSINESS_ID: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const PRODUCT_ID: string = 'e8d3486e-43f6-4a4d-a65e-2c991051786f';
const VARIANT_1_ID: string = 'dd5ddc0a-0672-40e3-8545-8c7f6c6dbf46';
const VARIANT_2_ID: string = '85b02a39-7bee-4072-b63c-d77f6c6dbf46';

const VARIANTS_DTO = [
  {
    _id: VARIANT_1_ID,
    description: 'brown sugar',
    options: [{ name: 'Color', value: 'Brown' }],
    price: 7,
    sku: 'BR-123',
    title: 'brown sugar',
  },
  {
    _id: VARIANT_2_ID,
    description: 'brown sugar',
    options: [{ name: 'Color', value: 'Brown' }],
    price: 7,
    sku: 'BR-321',
    title: 'brown sugar',
  },
];

class ProductWithVariantFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');
  private readonly productVariantModel: Model<ProductVariantModel> = this.application.get('ProductVariantModel');

  public async apply(): Promise<void> {
    const business = await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));

    const product = await this.productModel.create(productFactory({
      uuid: PRODUCT_ID,
      businessId: business._id,
      title: 'Original',
      price: 30,
    }));

    const variantsPromises = VARIANTS_DTO.map(variant => this.productVariantModel.create(variantFactory({
      ...variant,
      product: product._id,
      businessId: product.businessId,
    })));

    await Promise.all(variantsPromises);
  }
}

export = ProductWithVariantFixture;
