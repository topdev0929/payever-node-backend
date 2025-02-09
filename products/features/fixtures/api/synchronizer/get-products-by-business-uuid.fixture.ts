import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { businessFactory, productFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';

const BUSINESS_ID_1: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const BUSINESS_ID_2: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

class GetProductsByBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID_1,
    }));
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID_2,
    }));

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      slug: 'some 379',
      uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_2,
      slug: 'some 4e5',
      uuid: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      slug: 'some e56',
      uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
    }));
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID_1,
      slug: 'some a48',
      uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
    }));
  }
}

export = GetProductsByBusinessFixture;
