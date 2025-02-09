import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel, ProductRecommendationsModel } from '../../../../src/products/models';
import { businessFactory, productFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';

const BUSINESS_ID_1: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const PRODUCT_ID_1: string = '3799bb06-929a-11e9-b5a6-7200004fe4c0';
const PRODUCT_REC_ID_1: string = '4e58fe33-97d3-41d0-a789-cf43a11e469f';
const PRODUCT_REC_ID_2: string = 'e563339f-0b4c-4aef-92e7-203b9761981c';
const PRODUCT_REC_ID_3: string = 'a482bf57-1aec-4304-8751-4ce5cea603a4';

class GetProductsRecommendationForBuilderFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');
  private readonly recommendationsModel: Model<ProductRecommendationsModel> = this.application.get('ProductRecommendationsModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID_1,
    }));

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      title: 'test product 1',
      uuid: PRODUCT_ID_1,
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      title: 'product recommendation 1',
      uuid: PRODUCT_REC_ID_1,
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      title: 'product recommendation 2',
      uuid: PRODUCT_REC_ID_2,
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      title: 'product recommendation 3',
      uuid: PRODUCT_REC_ID_3,
    }));

    await this.recommendationsModel.create({
      businessId : BUSINESS_ID_1,
      productId: PRODUCT_ID_1,
      recommendations : [
        {
          id : PRODUCT_REC_ID_1,
          name: 'product recommendation 1',
        },
        {
          id : PRODUCT_REC_ID_2,
          name: 'product recommendation 2',
        },
        {
          id : PRODUCT_REC_ID_3,
          name: 'product recommendation 3',
        },
      ],
      sku: 'SKU1234',
      tag : 'byCategory',
    });
  }
}

export = GetProductsRecommendationForBuilderFixture;
