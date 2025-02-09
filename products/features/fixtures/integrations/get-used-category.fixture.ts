import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../src/products/models';
import { businessFactory, productFactory } from '../factories';
import { BusinessModel, BusinessSchemaName } from '../../../src/business';
import { CategorySchemaName } from "../../../src/categories/schemas";
import { CategoryModel } from "../../../src/categories/models";

const BUSINESS_ID_1: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const BUSINESS_ID_2: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

class GetUsedCategory extends BaseFixture {
  private readonly categoryModel: Model<CategoryModel> = this.application.get(getModelToken(CategorySchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');

  public async apply(): Promise<void> {
    await this.categoryModel.create(businessFactory(
        {
          "_id": "24edafe1-28c3-4286-b0b7-675d2c79deb1",
          "ancestors": [],
          "attributes": [],
          "businessId": BUSINESS_ID_1,
          "name": "Arts & Crafts",
          "slug": "arts_and_crafts",
        }
    ));

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      category: '24edafe1-28c3-4286-b0b7-675d2c79deb1',
      title: 'test product 1',
      uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    } as any));
  }
}

export = GetUsedCategory;
