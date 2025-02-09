import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { businessFactory, productFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';
import { AttributeTypesEnum } from '../../../../src/categories/enums';

const BUSINESS_ID: string = 'a560407c-b98d-40eb-8565-77c0d7ae23ea';

class GetProductsForBuilderFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      example: true,
      title: 'test sample product 1',
      uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
      attributes: [
        {
          type: AttributeTypesEnum.numeric,
          name: "test_name1",
          value: "test_value1",
        },
        {
          type: AttributeTypesEnum.text,
          name: "test_name2",
          value: "test_value2",
        },
      ],
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      example: true,
      title: 'test sample product 2',
      uuid: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      example: true,
      title: 'test sample product 3',
      uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      example: true,
      title: 'test sample product 4',
      uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
    }));
  }
}

export = GetProductsForBuilderFixture;
