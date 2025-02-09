import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { ProductModel } from '../../../../src/products/models';
import { Model } from 'mongoose';
import { ProductVariantModel } from '../../../../src/products/models/product-variant.model';

export = class DeleteProductsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const productModel: Model<ProductModel> = this.application.get(getModelToken('Product'));
    const variantModel: Model<ProductVariantModel> = this.application.get(getModelToken('ProductVariant'));

    const businessId: string = 'a560407c-b98d-40eb-8565-77c0d7ae23ea';

    const firstProduct: { id: string; variants: string[] } = {
      id: '8ec067ba-b673-40b1-baa4-e05856acf637',
      variants: ['93d15e86-9fc5-48d4-b6b4-8b37ae21b771', '8da1fa8a-4d21-4179-8de9-9ff7878bd8b8'],
    };

    await productModel.create({
      _id: firstProduct.id,
      businessId,
      price: 3.14,
      title: 'Product 1',
      uuid: firstProduct.id,
      variants: [firstProduct.variants[0], firstProduct.variants[1]],
    });

    await variantModel.create({
      _id: firstProduct.variants[0],
      businessId,
      images: ['img1', 'img2'],
      price: 12,
      product: firstProduct.id,
      title: 'variant 1',
    });

    await variantModel.create({
      _id: firstProduct.variants[1],
      businessId,
      price: 11,
      product: firstProduct.id,
      title: 'variant 2',
    });

    const secondProduct: { id: string; variants: string[] } = {
      id: '406e4c1b-b0f8-48d3-9956-95657a36957b',
      variants: ['35c0815e-9466-4b53-b22a-9db2f914b346', '6a500f99-b905-440c-ae7a-c985b9c79cfd'],
    };

    await productModel.create({
      _id: secondProduct.id,
      businessId,
      price: 2.28,
      title: 'Product 2',
      uuid: secondProduct.id,
      variants: [secondProduct.variants[0], secondProduct.variants[1]],
    });

    await variantModel.create({
      _id: secondProduct.variants[0],
      businessId,
      price: 1,
      product: secondProduct.id,
      title: 'variant 1',
    });

    await variantModel.create({
      _id: secondProduct.variants[1],
      businessId,
      images: ['img1', 'img2'],
      price: 2,
      product: secondProduct.id,
      title: 'variant 2',
    });
  }
};
